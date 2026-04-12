-- AlterTable
ALTER TABLE "destinations" ADD COLUMN "image_urls" TEXT[] DEFAULT ARRAY[]::TEXT[];
