import { query } from "../../lib/db";

// GET handler for fetching trips
export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { rows } = await query("SELECT * FROM Trip"); // Adjust the query as needed
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching trips:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
