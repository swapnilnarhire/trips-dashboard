import { query } from "@/lib/db";
import { differenceInDays, parseISO } from "date-fns";

// Helper function to calculate the TAT status
const calculateTatStatus = ({
  tripStartTime,
  tripEndTime,
  lastPingTime,
  etaDays,
}) => {
  // Parse trip start time
  const start =
    tripStartTime && typeof tripStartTime === "string"
      ? parseISO(tripStartTime)
      : null;

  // Parse trip end time or last ping time
  const end =
    tripEndTime && typeof tripEndTime === "string"
      ? parseISO(tripEndTime)
      : lastPingTime && typeof lastPingTime === "string"
      ? parseISO(lastPingTime)
      : null;

  // Debugging: Log parsed dates
  console.log("Parsed Dates:", { start, end, etaDays });

  // Rule 3: If etaDays is 0 or negative, return "Others"
  if (etaDays <= 0) {
    return "Others";
  }

  // If both start and end are null, we cannot calculate time taken
  if (!start) {
    console.warn("Start time is null or invalid.");
    return "Others";
  }

  if (!end) {
    console.warn("End time is null or invalid.");
    return "Others";
  }

  // Calculate time taken in days
  const timeTakenDays = differenceInDays(end, start);

  // Debugging: Log calculated time taken
  console.log("Time Taken Days:", timeTakenDays);

  // Rule 1: If etaDays is less than or equal to time taken, return "On Time"
  if (etaDays >= timeTakenDays) {
    return "On Time";
  }

  // Rule 2: If etaDays is greater than time taken, return "Delayed"
  return "Delayed";
};

export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { pageNo = 1, size = 10 } = req.body;

  // Validate pageNo and size
  if (typeof pageNo !== "number" || typeof size !== "number") {
    return res
      .status(400)
      .json({ error: "Page number and size must be numbers." });
  }

  if (pageNo < 1) {
    return res
      .status(400)
      .json({ error: "Page number must be greater than 0." });
  }

  if (size < 1) {
    return res.status(400).json({ error: "Page size must be greater than 0." });
  }

  const offset = (pageNo - 1) * size;

  // SQL query to retrieve all details from trips table along with related data
  const sql = `
    SELECT 
        trip.*,
        transporter.transporter_name, 
        transporter.phone_number, 
        source_location.location_name AS source_name, 
        source_location.latitude AS source_latitude, 
        source_location.longitude AS source_longitude, 
        destination_location.location_name AS destination_name, 
        destination_location.latitude AS destination_latitude, 
        destination_location.longitude AS destination_longitude, 
        statusTrip.status_code AS current_status_code,
        statusTrip.status_name AS current_status
    FROM 
        trips AS trip
    INNER JOIN 
        transporter ON trip.transporter_id = transporter.transporter_id
    INNER JOIN 
        location AS source_location ON trip.source_id = source_location.location_id
    INNER JOIN 
        location AS destination_location ON trip.destination_id = destination_location.location_id
    INNER JOIN 
        statusTrip ON trip.statusfortrip_id = statusTrip.statusfortrip_id
    LIMIT $1 OFFSET $2;
  `;

  // SQL query to count total number of trips
  const countSql = `SELECT COUNT(*) FROM trips`;

  try {
    const totalTripsResult = await query(countSql);
    const totalTrips = parseInt(totalTripsResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalTrips / size);

    const result = await query(sql, [size, offset]);

    const data = result.rows.map((row) => ({
      _id: row._id,
      tripId: row.trip_id,
      transporter: row.transporter_name,
      tripStartTime: row.trip_start_time,
      currentStatusCode: row.current_status_code,
      currentStatus: row.current_status,
      phoneNumber: row.phone_number,
      etaDays: row.eta_days,
      distanceRemaining: row.distance_remaining,
      tripEndTime: row.trip_end_time || "",
      source: row.source_name,
      sourceLatitude: row.source_latitude,
      sourceLongitude: row.source_longitude,
      dest: row.destination_name,
      destLatitude: row.destination_latitude,
      destLongitude: row.destination_longitude,
      lastPingTime: row.last_ping_time,
      createdAt: row.created_at,
      tatStatus: calculateTatStatus({
        tripStartTime: row.trip_start_time,
        tripEndTime: row.trip_end_time,
        lastPingTime: row.last_ping_time,
        etaDays: row.eta_days,
      }),
    }));

    res.status(200).json({
      currentPage: pageNo,
      totalPages,
      totalTrips,
      pageSize: size,
      trips: data,
    });
  } catch (error) {
    console.error("Error retrieving paginated trips data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
