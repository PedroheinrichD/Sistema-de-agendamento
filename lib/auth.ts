import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      ca: fs.readFileSync(
        path.join(process.cwd(), "certs", "ca.pem"),
      ),
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }),

  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },

  plugins: [
    admin(),
  ],
});