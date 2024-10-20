// pages/api/insertTrips.js

import { data } from "@/lib/data";
import insertData from "@/lib/insertData";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await insertData(data);
      res.status(200).json({ message: "Data inserted successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Failed to insert data" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
