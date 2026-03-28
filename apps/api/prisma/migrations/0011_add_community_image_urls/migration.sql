-- AlterTable: couple.community_posts - add image_urls column
ALTER TABLE "couple"."community_posts" ADD COLUMN "image_urls" TEXT[] NOT NULL DEFAULT '{}';

-- AlterTable: pet.community_posts - add image_urls column
ALTER TABLE "pet"."community_posts" ADD COLUMN "image_urls" TEXT[] NOT NULL DEFAULT '{}';
