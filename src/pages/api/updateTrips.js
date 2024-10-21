import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { tripIds, statusForTripId, statusDate } = req.body; // Added statusDate

    // Validate required fields
    if (!tripIds || !Array.isArray(tripIds) || tripIds.length === 0) {
      return res
        .status(400)
        .json({ error: "tripIds must be an array and cannot be empty." });
    }

    if (!statusForTripId) {
      return res.status(400).json({ error: "status cannot be empty." });
    }

    if (!statusDate) {
      return res.status(400).json({ error: "statusDate cannot be empty." });
    }

    try {
      const updatePromises = tripIds.map(async (tripId) => {
        let queryString = `UPDATE trips SET statusForTrip_id = $1, last_ping_time = $2`;
        const params = [statusForTripId, statusDate]; // Use the date here

        // If the statusForTripId indicates delivery (2), update trip_end_time
        if (statusForTripId === 2) {
          queryString += `, trip_end_time = NOW()`;
        }

        queryString += ` WHERE _id = $3 RETURNING *`;
        params.push(tripId);

        const result = await query(queryString, params);
        return result.rows[0]; // Return updated trip data
      });

      const updatedTrips = await Promise.all(updatePromises);
      res.status(200).json(updatedTrips);
    } catch (error) {
      console.error("Error updating trips:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
