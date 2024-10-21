import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  const locations = req.body;

  // Validate if the locations data is an array
  if (!Array.isArray(locations) || locations.length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid data format or empty array" });
  }

  try {
    // Begin transaction
    await query("BEGIN");

    // Create bulk insert query
    const insertQuery = `
      INSERT INTO location (location_name, latitude, longitude) 
      VALUES ${locations
        .map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
        .join(", ")}
    `;

    // Flatten array of location data into a single array of parameters
    const params = locations.flatMap(
      ({ location_name, latitude, longitude }) => [
        location_name,
        latitude,
        longitude,
      ]
    );

    // Execute the query to insert all locations at once
    await query(insertQuery, params);

    // Commit transaction
    await query("COMMIT");

    // Send success response
    res.status(200).json({ message: "Locations inserted successfully!" });
  } catch (error) {
    // Rollback transaction in case of error
    await query("ROLLBACK");
    console.error("Error inserting locations:", error.message);
    res
      .status(500)
      .json({ message: "Error inserting locations", error: error.message });
  }
}
