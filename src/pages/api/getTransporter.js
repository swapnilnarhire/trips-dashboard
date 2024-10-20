import { query } from "@/lib/db";

export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // SQL query to fetch paginated trips
  const sql = `SELECT * FROM transporter`;

  try {
    // Fetch paginated trips
    const result = await query(sql);
    const data = result.rows.map(
      ({ transporter_id, phone_number, transporter_name }) => ({
        label: transporter_name,
        value: transporter_id,
        phone_number,
      })
    );

    // Return the paginated data along with metadata
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving transporter data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
