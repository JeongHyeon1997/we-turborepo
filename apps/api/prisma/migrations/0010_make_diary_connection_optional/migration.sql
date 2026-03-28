-- AlterTable: couple.diary_entries - make couple_connection_id nullable
ALTER TABLE "couple"."diary_entries" ALTER COLUMN "couple_connection_id" DROP NOT NULL;

-- AlterTable: marriage.diary_entries - make marriage_connection_id nullable
ALTER TABLE "marriage"."diary_entries" ALTER COLUMN "marriage_connection_id" DROP NOT NULL;
