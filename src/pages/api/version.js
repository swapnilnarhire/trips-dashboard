// pages/api/version.js
import db from "@/lib/db";

export default async function handler(req, res) {
  try {
    const client = await db.connect();
    const result = await client.query("SELECT VERSION()");
    const version = result.rows[0].version;
    client.release();
    res.status(200).json({ version });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
