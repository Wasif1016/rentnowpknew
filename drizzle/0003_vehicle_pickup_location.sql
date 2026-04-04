ALTER TABLE "vehicles" ADD COLUMN "pickup_latitude" double precision;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "pickup_longitude" double precision;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "pickup_place_id" text;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "pickup_formatted_address" text;