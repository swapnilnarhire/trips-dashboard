import { query } from "@/lib/db";
import { v4 as uuidv4 } from "uuid"; // Install uuid package if you choose this

// Inside your POST request handler
const trip_id = uuidv4();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { _id, source_id, destination_id, transporter_id } = req.body;

    // Validate required fields
    if (!source_id || !destination_id || !transporter_id) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      // Insert trip data into the database
      const result = await query(
        `INSERT INTO trips (
          trip_id,
          _id,
          trip_start_time,
          last_ping_time,
          transporter_id,
          source_id,
          destination_id,
          statusForTrip_id,
          created_at
        ) VALUES (
          $1,
          $2,
          NOW(),
          NOW(),
          $3,
          $4,
          $5,
          $6,
          NOW()
        ) RETURNING *`,
        [trip_id, _id, transporter_id, source_id, destination_id, 3]
      );
      // Send the inserted trip data back in response
      const insertedTrip = result.rows[0];
      res.status(201).json(insertedTrip);
    } catch (error) {
      console.error("Error inserting trip:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Handle method not allowed
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
