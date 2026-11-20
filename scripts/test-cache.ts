import "dotenv/config";
import { prisma } from "../lib/prisma";
import { unstable_cache } from "next/cache";

console.log("Checking unstable_cache...");
