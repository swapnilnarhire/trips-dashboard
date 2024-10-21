import { query } from "./db";

const insertData = async (data) => {
  const locationIds = new Map();
  const transporterIds = new Map();
  const statusIds = new Map();

  try {
    // Begin a transaction
    await query("BEGIN");

    for (const trip of data) {
      const {
        _id,
        tripId,
        transporter,
        tripStartTime,
        currentStatusCode,
        currenStatus,
        phoneNumber,
        etaDays,
        distanceRemaining,
        tripEndTime,
        source,
        sourceLatitude,
        sourceLongitude,
        dest,
        destLatitude,
        destLongitude,
        lastPingTime,
        createdAt,
      } = trip;

      // Insert Transporter
      if (!transporterIds.has(transporter)) {
        const transporterInsertQuery = `
          INSERT INTO transporter (transporter_name, phone_number) 
          VALUES ($1, $2)
          ON CONFLICT (transporter_name) DO NOTHING 
          RETURNING transporter_id;
        `;
        const transporterValues = [transporter, phoneNumber];
        const transporterResult = await query(
          transporterInsertQuery,
          transporterValues
        );

        const transporterId =
          transporterResult.rows.length > 0
            ? transporterResult.rows[0].transporter_id
            : transporterIds.get(transporter);

        transporterIds.set(transporter, transporterId);
      }

      const transporterId = transporterIds.get(transporter);

      // Insert Source Location
      const sourceKey = `${source}-${sourceLatitude}-${sourceLongitude}`;
      if (!locationIds.has(sourceKey)) {
        const sourceLocationInsertQuery = `
          INSERT INTO location (location_name, latitude, longitude) 
          VALUES ($1, $2, $3)
          ON CONFLICT (location_name) DO NOTHING 
          RETURNING location_id;
        `;
        const sourceLocationValues = [source, sourceLatitude, sourceLongitude];
        const sourceLocationResult = await query(
          sourceLocationInsertQuery,
          sourceLocationValues
        );

        const sourceLocationId =
          sourceLocationResult.rows.length > 0
            ? sourceLocationResult.rows[0].location_id
            : locationIds.get(sourceKey);

        locationIds.set(sourceKey, sourceLocationId);
      }

      const sourceLocationId = locationIds.get(sourceKey);

      // Insert Destination Location
      const destKey = `${dest}-${destLatitude}-${destLongitude}`;
      if (!locationIds.has(destKey)) {
        const destLocationInsertQuery = `
          INSERT INTO location (location_name, latitude, longitude) 
          VALUES ($1, $2, $3)
          ON CONFLICT (location_name) DO NOTHING 
          RETURNING location_id;
        `;
        const destLocationValues = [dest, destLatitude, destLongitude];
        const destLocationResult = await query(
          destLocationInsertQuery,
          destLocationValues
        );

        const destLocationId =
          destLocationResult.rows.length > 0
            ? destLocationResult.rows[0].location_id
            : locationIds.get(destKey);

        locationIds.set(destKey, destLocationId);
      }

      const destLocationId = locationIds.get(destKey);

      // Insert Status
      if (!statusIds.has(currentStatusCode)) {
        const statusInsertQuery = `
          INSERT INTO statusTrip (status_code, status_name) 
          VALUES ($1, $2)
          ON CONFLICT (status_code) DO NOTHING 
          RETURNING statusForTrip_id;
        `;
        const statusValues = [currentStatusCode, currenStatus];
        const statusResult = await query(statusInsertQuery, statusValues);

        const statusId =
          statusResult.rows.length > 0
            ? statusResult.rows[0].statusForTrip_id
            : statusIds.get(currentStatusCode);

        statusIds.set(currentStatusCode, statusId);
      }

      const statusId = statusIds.get(currentStatusCode);

      // Insert Trip
      const tripInsertQuery = `
        INSERT INTO trips (tripid, _id, tripstarttime, etadays, distanceremaining, tripendtime, lastpingtime, createdat, statusfortrip_id, transporter_id, source_location_id, dest_location_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
      `;
      const tripValues = [
        tripId,
        _id,
        tripStartTime,
        etaDays,
        distanceRemaining,
        tripEndTime || null,
        lastPingTime || null,
        createdAt,
        statusId,
        transporterId,
        sourceLocationId,
        destLocationId,
      ];
      await query(tripInsertQuery, tripValues);
    }

    await query("COMMIT");
    console.log("Data inserted successfully!");
  } catch (error) {
    // Rollback in case of an error
    await query("ROLLBACK");
    console.error("Error inserting data:", error.message);
  }
};

export default insertData;
