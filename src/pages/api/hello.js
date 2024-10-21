// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Reference } from "yup";

export default function handler(req, res) {
  res.status(200).json({ name: "John Doe" });
}

// Reference
// CREATE TABLE transporter (
//   transporter_id SERIAL PRIMARY KEY,
//   transporter_name VARCHAR(255) NOT NULL UNIQUE,
//   phone_number VARCHAR(15) NOT NULL
// );
// CREATE TABLE statusTrip (
//   statusForTrip_id SERIAL PRIMARY KEY,  -- Auto-incrementing primary key
//   status_code VARCHAR(10) NOT NULL UNIQUE,     -- Status code must be unique
//   status_name VARCHAR(255) NOT NULL      -- Status name
// );
// CREATE TABLE location (
//   location_id SERIAL PRIMARY KEY,
//   location_name VARCHAR(255) NOT NULL UNIQUE,
//   latitude DECIMAL(9,6) NOT NULL,
//   longitude DECIMAL(9,6) NOT NULL
// );
// CREATE TABLE trips (
//   trip_id UUID PRIMARY KEY,  -- Assuming tripId is unique for each trip
//   _id VARCHAR(24) NOT NULL,  -- Storing _id as a VARCHAR with user-entered format
//   trip_start_time TIMESTAMP NOT NULL,  -- When the trip started
//   eta_days INTEGER,  -- Estimated time of arrival in days
//   distance_remaining DECIMAL(10, 2),  -- Distance remaining in kilometers
//   trip_end_time TIMESTAMP,  -- End time of the trip (NULL if ongoing)
//   last_ping_time TIMESTAMP,  -- Last ping time from the tracking system
//   created_at TIMESTAMP NOT NULL,  -- When the trip record was created
//   transporter_id INTEGER NOT NULL,  -- Foreign key from transporter table
//   source_id INTEGER NOT NULL,  -- Foreign key from location table (source location)
//   destination_id INTEGER NOT NULL,  -- Foreign key from location table (destination location)
//   statusForTrip_id INTEGER NOT NULL,  -- Foreign key from statusTrip table
//   CONSTRAINT fk_transporter FOREIGN KEY (transporter_id) REFERENCES transporter(transporter_id),
//   CONSTRAINT fk_source_location FOREIGN KEY (source_id) REFERENCES location(location_id),
//   CONSTRAINT fk_destination_location FOREIGN KEY (destination_id) REFERENCES location(location_id),
//   CONSTRAINT fk_status_for_trip FOREIGN KEY (statusForTrip_id) REFERENCES statusTrip(statusForTrip_id)
// );
