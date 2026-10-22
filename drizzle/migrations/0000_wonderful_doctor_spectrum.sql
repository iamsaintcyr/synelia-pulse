CREATE TABLE IF NOT EXISTS "feedback_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"work_context" varchar(50),
	"satisfaction_score" integer,
	"obstacles" text[],
	"obstacle_other" text,
	"improvements" text[],
	"improvement_other" text,
	"ai_perception" text[],
	"comment" text,
	"additional_comment" text
);
