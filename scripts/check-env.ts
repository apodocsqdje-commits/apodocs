import { config } from "dotenv";
config();

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "SET (" + process.env.DATABASE_URL.substring(0, 30) + "...)" : "UNDEFINED");
console.log("DIRECT_URL:", process.env.DIRECT_URL ? "SET" : "UNDEFINED");
