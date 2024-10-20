import { Pool } from "pg";

// Create a pool instance with SSL enabled for Neon
const pool = new Pool({
  host: process.env.DB_HOST, // e.g., 'your-neon-project.neon.tech'
  user: process.env.DB_USER, // e.g., 'trips_dashboard_owner'
  password: process.env.DB_PASSWORD, // e.g., 'your_password'
  database: process.env.DB_NAME, // e.g., 'trips_dashboard'
  port: process.env.DB_PORT || 5432, // Default PostgreSQL port
  ssl: {
    rejectUnauthorized: true, // Set to true for production with valid CA
    // Optional: You can add 'ca' for CA certificate if needed
  },
});

// Export query function to be used across the app
export const query = (text, params) => {
  return pool.query(text, params);
};

// Optional: Handle pool errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});
