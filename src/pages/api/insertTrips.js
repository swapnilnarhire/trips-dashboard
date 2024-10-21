import { data } from "@/lib/data"; // Import the trip data
import { query } from "@/lib/db"; // Import your existing query function

// API route handler
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Begin transaction
      await query("BEGIN");

      for (const trip of data) {
        // Get transporter_id
        const transporterRes = await query(
          "SELECT transporter_id FROM transporter WHERE transporter_name = $1",
          [trip.transporter]
        );
        const transporter_id = transporterRes.rows[0]?.transporter_id;

        // Check if transporter_id is found
        if (!transporter_id) {
          console.error(`Transporter not found for: ${trip.transporter}`);
          break; // Skip to the next trip if transporter is not found
        } else {
          console.log("transporter_id", transporter_id);
        }

        // Get source_id
        const sourceRes = await query(
          "SELECT location_id FROM location WHERE latitude = $1 AND longitude = $2",
          [trip.sourceLatitude, trip.sourceLongitude]
        );
        const source_id = sourceRes.rows[0]?.location_id;

        // Check if source_id is found
        if (!source_id) {
          console.error(
            `Source location not found for: ${trip.source} with lat ${trip.sourceLatitude} and lon ${trip.sourceLongitude}`
          );
          break; // Skip to the next trip if source location is not found
        } else {
          console.log("source_id", source_id);
        }
        // Get destination_id
        const destRes = await query(
          "SELECT location_id FROM location WHERE latitude = $1 AND longitude = $2",
          [trip.destLatitude, trip.destLongitude]
        );
        const destination_id = destRes.rows[0]?.location_id;

        // Check if destination_id is found
        if (!destination_id) {
          console.error(
            `Destination location not found for: ${trip.dest} with lat ${trip.destLatitude} and lon ${trip.destLongitude}`
          );
          break; // Skip to the next trip if destination location is not found
        } else {
          console.log("destination_id", destination_id);
        }

        // Get statusForTrip_id
        const statusCode = trip.currentStatusCode.trim();
        const statusRes = await query(
          "SELECT statusForTrip_id FROM statusTrip WHERE status_code = $1",
          [statusCode]
        );

        const statusForTrip_id = statusRes.rows[0]?.statusForTrip_id;

        // Check if statusForTrip_id is found
        if (!statusForTrip_id) {
          console.error(`Status not found for code: ${trip.currentStatusCode}`);
          break; // Skip to the next trip if status is not found
        } else {
          console.log("statusForTrip_id", statusForTrip_id);
        }
        // Insert query for the trip
        await query(
          `INSERT INTO trips (trip_id, _id, trip_start_time, eta_days, distance_remaining, trip_end_time, last_ping_time, created_at, transporter_id, source_id, destination_id, statusForTrip_id) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            trip.tripId,
            trip._id,
            trip.tripStartTime || null,
            trip.etaDays || null,
            trip.distanceRemaining || null,
            trip.tripEndTime || null,
            trip.lastPingTime || null,
            trip.createdAt,
            transporter_id,
            source_id,
            destination_id,
            transporter_id,
          ]
        );
      }

      // Commit transaction
      await query("COMMIT");
      res.status(200).json({ message: "Trips inserted successfully" });
    } catch (error) {
      // Rollback transaction in case of error
      await query("ROLLBACK");
      console.error("Error inserting trips:", error);
      res.status(500).json({ error: "Failed to insert trips" });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
