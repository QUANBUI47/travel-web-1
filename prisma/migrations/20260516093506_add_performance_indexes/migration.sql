-- CreateIndex
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "bookings_created_at_idx" ON "bookings"("created_at");

-- CreateIndex
CREATE INDEX "system_settings_group_idx" ON "system_settings"("group");

-- CreateIndex
CREATE INDEX "tour_departures_tour_id_start_date_idx" ON "tour_departures"("tour_id", "start_date");

-- CreateIndex
CREATE INDEX "tours_destination_id_idx" ON "tours"("destination_id");

-- CreateIndex
CREATE INDEX "tours_is_active_idx" ON "tours"("is_active");
