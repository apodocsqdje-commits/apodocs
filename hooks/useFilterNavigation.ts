"use client";

import { useCallback, useEffect, useRef, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * All filter interactions are coalesced into a single URL navigation.
 *
 * Why: every `router.push`/`router.replace` on `/documents` triggers a full
 * RSC round-trip (and therefore a database round-trip). Firing one navigation
 * per changed parameter made the UI issue several sequential requests while
 * the user was still tweaking filters. With this hook the pending changes are
 * merged and flushed once, so a single request contains the final filter state.
 */
const FILTER_DEBOUNCE_MS = 300;

export type FilterUpdates = Record<string, string | null | undefined>;

interface UpdateOptions {
  /** Skip the debounce window (useful for "clear" buttons). */
  immediate?: boolean;
}

export function useFilterNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  /**
   * The last query string we know about. It is updated synchronously when we
   * navigate so that two fast interactions can never build their URL from the
   * same stale `searchParams` snapshot (which used to drop a filter).
   */
  const committedRef = useRef<URLSearchParams>(
    new URLSearchParams(searchParams.toString())
  );
  const pendingRef = useRef<FilterUpdates>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-sync when the URL changes from the outside (back/forward, links, reset).
  useEffect(() => {
    committedRef.current = new URLSearchParams(searchParams.toString());
  }, [searchParams]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const flush = useCallback(() => {
    clearTimer();

    const pending = pendingRef.current;
    pendingRef.current = {};

    if (Object.keys(pending).length === 0) return;

    const params = new URLSearchParams(committedRef.current.toString());
    // Any filter change must go back to the first page.
    params.delete("page");

    for (const [key, value] of Object.entries(pending)) {
      const nextValue = typeof value === "string" ? value.trim() : "";
      if (nextValue) {
        params.set(key, nextValue);
      } else {
        params.delete(key);
      }
    }

    // Keep the ref in sync before the navigation resolves, otherwise a second
    // change made during the transition would rebuild from the old params.
    committedRef.current = params;

    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }, [clearTimer, pathname, router, startTransition]);

  const updateFilters = useCallback(
    (updates: FilterUpdates, options: UpdateOptions = {}) => {
      Object.assign(pendingRef.current, updates);

      if (options.immediate) {
        flush();
        return;
      }

      clearTimer();
      timerRef.current = setTimeout(flush, FILTER_DEBOUNCE_MS);
    },
    [clearTimer, flush]
  );

  const resetFilters = useCallback(() => {
    clearTimer();
    pendingRef.current = {};
    committedRef.current = new URLSearchParams();

    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [clearTimer, pathname, router, startTransition]);

  // Never navigate after the component has unmounted.
  useEffect(() => () => clearTimer(), [clearTimer]);

  return { updateFilters, resetFilters, isPending };
}
