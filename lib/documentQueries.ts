import type { DocumentCardItem } from "@/components/DocumentCard";
import type { DocType } from "@prisma/client";
import { pool } from "@/lib/dbPool";

/**
 * Read-only document queries run through `pg` directly (no Prisma Client).
 *
 * Prisma's query engine initialization is several seconds on a cold serverless
 * isolate, which was the main reason `/documents` and search took ~10s on the
 * deployed app. The SQL below is fully parameterized; the only dynamic part is
 * the fixed list of `AND`/`OR` conditions, never user input itself.
 */

export const PAGE_SIZE = 12;

export type DocumentRow = {
  id: string;
  title: string;
  type: string;
  fileUrl: string;
  status: string;
  authorName: string | null;
  likes: number;
  createdAt: Date;
  subjectName: string;
  subjectSemester: number;
  departmentName: string;
  facultyName: string;
  facultyAcronym: string;
  totalCount?: number;
} & Record<string, unknown>;

export interface DocumentsQueryArgs {
  search: string;
  faculty: string;
  filiereName: string;
  semester: number | null;
  moduleName: string;
  docType: DocType | null;
  skip: number;
}

export interface DocumentsQueryResult {
  totalCount: number;
  documents: DocumentCardItem[];
}

const DOCUMENT_COLUMNS = `
  d.id,
  d.title,
  d.type::text AS "type",
  d."fileUrl" AS "fileUrl",
  d.status::text AS "status",
  d."authorName" AS "authorName",
  d.likes,
  d."createdAt" AS "createdAt",
  s.name AS "subjectName",
  s.semester AS "subjectSemester",
  dep.name AS "departmentName",
  f.name AS "facultyName",
  f.acronym AS "facultyAcronym"
`;

const DOCUMENT_JOINS = `
  FROM "Document" d
  INNER JOIN "Subject" s ON s.id = d."subjectId"
  INNER JOIN "Department" dep ON dep.id = s."departmentId"
  INNER JOIN "Faculty" f ON f.id = dep."facultyId"
`;

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

export function mapDocumentRow(row: DocumentRow): DocumentCardItem {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    fileUrl: row.fileUrl,
    status: row.status,
    authorName: row.authorName,
    likes: row.likes,
    createdAt: row.createdAt,
    subject: {
      name: row.subjectName,
      semester: row.subjectSemester,
      department: {
        name: row.departmentName,
        faculty: {
          name: row.facultyName,
          acronym: row.facultyAcronym,
        },
      },
    },
  };
}

/** Collects parameterized conditions without ever interpolating user input. */
function createParamBuilder() {
  const values: unknown[] = [];
  const param = (value: unknown) => {
    values.push(value);
    return `$${values.length}`;
  };
  return { values, param };
}

/**
 * One round-trip for both the page rows and the filtered total. An empty page
 * needs a second, lightweight COUNT query so pagination stays correct.
 */
export async function queryDocumentsPage(
  args: DocumentsQueryArgs
): Promise<DocumentsQueryResult> {
  const { values, param } = createParamBuilder();
  const conditions: string[] = [`d.status = 'APPROVED'`];

  if (args.search) {
    conditions.push(`d.title ILIKE ${param(`%${escapeLike(args.search)}%`)}`);
  }
  if (args.docType) {
    conditions.push(`d.type = CAST(${param(args.docType)} AS "DocType")`);
  }
  if (args.moduleName) {
    conditions.push(`s.name ILIKE ${param(`%${escapeLike(args.moduleName)}%`)}`);
  }
  if (args.semester !== null) {
    conditions.push(`s.semester = ${param(args.semester)}`);
  }
  if (args.filiereName) {
    conditions.push(`dep.name ILIKE ${param(`%${escapeLike(args.filiereName)}%`)}`);
  }
  if (args.faculty) {
    conditions.push(`LOWER(f.acronym) = LOWER(${param(args.faculty)})`);
  }

  const where = conditions.join(" AND ");
  const whereValues = [...values];
  const limit = param(PAGE_SIZE);
  const offset = param(args.skip);

  const result = await pool.query<DocumentRow>(
    `SELECT ${DOCUMENT_COLUMNS}, COUNT(*) OVER()::int AS "totalCount"
     ${DOCUMENT_JOINS}
     WHERE ${where}
     ORDER BY d."createdAt" DESC, d.id DESC
     LIMIT ${limit} OFFSET ${offset}`,
    values
  );

  if (result.rows.length > 0) {
    return {
      totalCount: result.rows[0].totalCount ?? 0,
      documents: result.rows.map(mapDocumentRow),
    };
  }

  const countResult = await pool.query<{ count: number }>(
    `SELECT COUNT(*)::int AS count ${DOCUMENT_JOINS} WHERE ${where}`,
    whereValues
  );

  return { totalCount: countResult.rows[0]?.count ?? 0, documents: [] };
}

export async function getDocumentByIdRaw(
  id: string
): Promise<DocumentCardItem | null> {
  const result = await pool.query<DocumentRow>(
    `SELECT ${DOCUMENT_COLUMNS} ${DOCUMENT_JOINS} WHERE d.id = $1 LIMIT 1`,
    [id]
  );
  const row = result.rows[0];
  return row ? mapDocumentRow(row) : null;
}

export async function getMyUploadsRaw(
  ids?: string[],
  token?: string
): Promise<DocumentCardItem[]> {
  const { values, param } = createParamBuilder();
  const conditions: string[] = [];

  if (token?.trim()) {
    conditions.push(`d."uploaderToken" = ${param(token.trim())}`);
  }
  if (ids && ids.length > 0) {
    conditions.push(`d.id = ANY(${param(ids.slice(-50))}::text[])`);
  }
  if (conditions.length === 0) return [];

  const result = await pool.query<DocumentRow>(
    `SELECT ${DOCUMENT_COLUMNS}
     ${DOCUMENT_JOINS}
     WHERE ${conditions.join(" OR ")}
     ORDER BY d."createdAt" DESC, d.id DESC
     LIMIT ${param(50)}`,
    values
  );

  return result.rows.map(mapDocumentRow);
}

export async function getMyUploadsByTokenRaw(
  token: string
): Promise<DocumentCardItem[]> {
  if (!token.trim()) return [];
  return getMyUploadsRaw(undefined, token);
}
