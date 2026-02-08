CREATE TABLE "stockings" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" varchar(20) NOT NULL,
	"exchange" varchar(10) NOT NULL,
	"stock_name" varchar(100) NOT NULL,
	"sector" varchar(50) NOT NULL,
	"purchase_price" numeric(12, 2) NOT NULL,
	"quantity" integer NOT NULL,
	"cmp" numeric(12, 2),
	"pe_ratio" numeric(8, 2),
	"earnings" numeric(16, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
