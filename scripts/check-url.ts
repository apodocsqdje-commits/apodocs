import { config } from "dotenv";
config();

const rawUrl = process.env.DATABASE_URL!;
console.log("Raw URL:", rawUrl.substring(0, 50) + "...");

const u = new URL(rawUrl);
console.log("user:", u.username);
console.log("pass raw:", u.password);
console.log("pass decoded:", decodeURIComponent(u.password));
console.log("host:", u.hostname);
console.log("port:", u.port);
console.log("db:", u.pathname);
