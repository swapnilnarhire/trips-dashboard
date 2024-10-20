const { query } = require("./db");

const insertData = async (data) => {
  try {
    // Begin a transaction
    await query("BEGIN");

    // Insert unique transporters first
    const transporterIds = new Map();
    for (const record of data) {
      const { transporter, phoneNumber } = record;

      if (!transporterIds.has(transporter)) {
        const transporterInsert = `
            INSERT INTO Transporter (transporter_name, phone_number)
            VALUES ($1, $2)
            ON CONFLICT (transporter_name) DO UPDATE SET phone_number = EXCLUDED.phone_number RETURNING transporter_id
          `;
        const res = await query(transporterInsert, [transporter, phoneNumber]);
        transporterIds.set(transporter, res.rows[0].transporter_id);
      }
    }

    // Insert unique locations (source and destination)
    const locationIds = new Map();
    for (const record of data) {
      const {
        source,
        sourceLatitude,
        sourceLongitude,
        dest,
        destLatitude,
        destLongitude,
      } = record;

      // Insert source location
      if (!locationIds.has(source)) {
        const sourceInsert = `
            INSERT INTO Location (location_name, latitude, longitude)
            VALUES ($1, $2, $3)
            ON CONFLICT (location_name) DO UPDATE SET latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude RETURNING location_id
          `;
        const res = await query(sourceInsert, [
          source,
          sourceLatitude,
          sourceLongitude,
        ]);
        locationIds.set(source, res.rows[0].location_id);
      }

      // Insert destination location
      if (!locationIds.has(dest)) {
        const destInsert = `
            INSERT INTO Location (location_name, latitude, longitude)
            VALUES ($1, $2, $3)
            ON CONFLICT (location_name) DO UPDATE SET latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude RETURNING location_id
          `;
        const res = await query(destInsert, [
          dest,
          destLatitude,
          destLongitude,
        ]);
        locationIds.set(dest, res.rows[0].location_id);
      }
    }

    // Prepare the trip insert query
    const tripInsert = `
        INSERT INTO Trip (trip_id, transporter_id, trip_start_time, trip_end_time, current_status_code,
                          current_status, eta_days, distance_remaining, last_ping_time, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (trip_id) DO NOTHING
      `;

    // Prepare the trip location insert query
    const tripLocationInsert = `
        INSERT INTO Trip_Location (trip_id, source_id, dest_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (trip_id, source_id, dest_id) DO NOTHING
      `;

    for (const record of data) {
      const {
        tripId,
        transporter,
        tripStartTime,
        tripEndTime,
        currentStatusCode,
        currenStatus,
        etaDays,
        distanceRemaining,
        lastPingTime,
        createdAt,
      } = record;

      const endTime = tripEndTime === "" ? null : tripEndTime;
      const lastPing = lastPingTime === "" ? null : lastPingTime;
      const created = createdAt === "" ? null : createdAt;

      try {
        await query(tripInsert, [
          tripId,
          transporterIds.get(transporter),
          tripStartTime,
          endTime,
          currentStatusCode,
          currenStatus,
          etaDays,
          distanceRemaining,
          lastPing,
          created,
        ]);

        await query(tripLocationInsert, [
          tripId,
          locationIds.get(record.source),
          locationIds.get(record.dest),
        ]);
      } catch (insertError) {
        console.error(
          `Error inserting trip ID ${tripId}:`,
          insertError.message
        );
      }
    }

    // Commit the transaction
    await query("COMMIT");
    console.log("Data inserted successfully!");
  } catch (error) {
    // Rollback in case of an error
    await query("ROLLBACK");
    console.error("Error inserting data:", error.message);
  }
};

export default insertData;
