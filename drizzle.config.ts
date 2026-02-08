import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
// import schema from "./app/(backend)/api/models/stockings"

export default defineConfig({
  out: './drizzle',
  schema: "./app/(backend)/api/models/**/*.ts",

  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

});
