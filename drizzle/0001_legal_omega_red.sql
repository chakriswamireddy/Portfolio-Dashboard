ALTER TABLE "stockings" RENAME COLUMN "updated_at" TO "cmp_updated_at";--> statement-breakpoint
ALTER TABLE "stockings" ADD COLUMN "fundamentals_updated_at" timestamp;