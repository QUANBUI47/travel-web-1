-- CreateEnum
CREATE TYPE "DepartureStatus" AS ENUM ('AVAILABLE', 'FULL', 'CANCELLED');

-- AlterTable
ALTER TABLE "tour_bookings" ADD COLUMN     "departure_id" TEXT;

-- AlterTable
ALTER TABLE "tours" ADD COLUMN     "departure_point" TEXT,
ADD COLUMN     "duration_text" TEXT,
ADD COLUMN     "exclusions" JSONB,
ADD COLUMN     "inclusions" JSONB,
ADD COLUMN     "old_price" DECIMAL(14,0),
ADD COLUMN     "policy" JSONB,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tour_type" TEXT,
ADD COLUMN     "transport" TEXT;

-- CreateTable
CREATE TABLE "tour_departures" (
    "id" TEXT NOT NULL,
    "tour_id" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "price_override" DECIMAL(14,0),
    "max_participants" INTEGER,
    "booked_count" INTEGER NOT NULL DEFAULT 0,
    "status" "DepartureStatus" NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tour_departures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tour_departures" ADD CONSTRAINT "tour_departures_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_bookings" ADD CONSTRAINT "tour_bookings_departure_id_fkey" FOREIGN KEY ("departure_id") REFERENCES "tour_departures"("id") ON DELETE SET NULL ON UPDATE CASCADE;
