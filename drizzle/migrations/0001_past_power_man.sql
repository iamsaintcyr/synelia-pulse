ALTER TABLE "feedback_responses" ADD COLUMN "satisfaction_trend" varchar(50);--> statement-breakpoint
ALTER TABLE "feedback_responses" ADD COLUMN "main_obstacle" varchar(100);--> statement-breakpoint
ALTER TABLE "feedback_responses" ADD COLUMN "ai_usage" varchar(50);--> statement-breakpoint
ALTER TABLE "feedback_responses" ADD COLUMN "enps" integer;--> statement-breakpoint
ALTER TABLE "feedback_responses" ADD COLUMN "retention_intent" varchar(50);