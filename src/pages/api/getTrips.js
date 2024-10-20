import { query } from "@/lib/db";
import { differenceInDays, parseISO } from "date-fns";

// Helper function to calculate the TAT status
const calculateTatStatus = ({
  tripStartTime,
  tripEndTime,
  lastPingTime,
  etaDays,
}) => {
  // Validate input dates and set start and end times accordingly
  const start = tripStartTime ? parseISO(tripStartTime) : null;
  const end = tripEndTime
    ? parseISO(tripEndTime)
    : lastPingTime
    ? parseISO(lastPingTime)
    : null;

  // If start time is invalid or both end times are invalid, return 'Others'
  if (!start || !end) {
    return "Others";
  }

  const timeTakenDays = differenceInDays(end, start);

  if (etaDays <= 0) {
    return "Others";
  } else if (etaDays >= timeTakenDays) {
    return "On Time";
  } else {
    return "Delayed";
  }
};

export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { pageNo = 1, size = 10 } = req.body; // Default pageNo = 1 and size = 10 if not provided

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

  // Calculate the offset and limit for pagination
  const offset = (pageNo - 1) * size;

  // SQL query to fetch paginated trips
  const sql = `
    SELECT 
        trip.trip_id, 
        trip.transporter_id, 
        trip.trip_start_time, 
        trip.current_status_code, 
        trip.current_status, 
        trip.eta_days, 
        trip.distance_remaining, 
        trip.trip_end_time, 
        trip.last_ping_time, 
        trip.created_at, 
        transporter.transporter_name, 
        transporter.phone_number, 
        source_location.location_name AS source_name, 
        source_location.latitude AS source_latitude, 
        source_location.longitude AS source_longitude, 
        destination_location.location_name AS destination_name, 
        destination_location.latitude AS destination_latitude, 
        destination_location.longitude AS destination_longitude
    FROM 
        trip
    INNER JOIN 
        transporter ON trip.transporter_id = transporter.transporter_id
    INNER JOIN 
        trip_location ON trip.trip_id = trip_location.trip_id
    INNER JOIN 
        location AS source_location ON trip_location.source_id = source_location.location_id
    INNER JOIN 
        location AS destination_location ON trip_location.dest_id = destination_location.location_id
    LIMIT $1 OFFSET $2;
  `;

  // SQL query to count total number of trips
  const countSql = `SELECT COUNT(*) FROM trip`;

  try {
    // Fetch total number of trips
    const totalTripsResult = await query(countSql);
    const totalTrips = parseInt(totalTripsResult.rows[0].count, 10);

    // Calculate total pages
    const totalPages = Math.ceil(totalTrips / size);

    // Fetch paginated trips
    const result = await query(sql, [size, offset]);
    const data = result.rows.map(
      ({
        trip_id,
        trip_start_time,
        current_status_code,
        current_status,
        phone_number,
        eta_days,
        distance_remaining,
        trip_end_time,
        source_name,
        source_latitude,
        source_longitude,
        destination_name,
        destination_latitude,
        destination_longitude,
        last_ping_time,
        created_at,
        transporter_name,
      }) => ({
        _id: trip_id, // Alias trip_id as _id
        tripId: trip_id,
        transporter: transporter_name,
        tripStartTime: trip_start_time,
        currentStatusCode: current_status_code,
        currenStatus: current_status,
        phoneNumber: phone_number,
        etaDays: eta_days,
        distanceRemaining: distance_remaining,
        tripEndTime: trip_end_time || "", // Default to empty string if null
        source: source_name,
        sourceLatitude: source_latitude,
        sourceLongitude: source_longitude,
        dest: destination_name,
        destLatitude: destination_latitude,
        destLongitude: destination_longitude,
        lastPingTime: last_ping_time,
        createdAt: created_at,
        tatStatus: calculateTatStatus(
          trip_start_time,
          trip_end_time,
          last_ping_time,
          eta_days
        ),
      })
    );

    // Return the paginated data along with metadata
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
