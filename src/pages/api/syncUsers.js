// pages/api/syncUsers.js

import jwt from "jsonwebtoken";
import axios from "axios";

const KEYCLOAK_PUBLIC_KEY = process.env.KEYCLOAK_PUBLIC_KEY; // Your Keycloak public key

const authenticateToken = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, KEYCLOAK_PUBLIC_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user; // Attach user info to request
  });
};

const handler = async (req, res) => {
  // Authenticate the token
  authenticateToken(req, res);

  // Only proceed if the token is valid
  if (req.user) {
    try {
      // Perform your user synchronization logic here
      const response = await axios.get("https://api.example.com/sync"); // Replace with your API logic

      // Respond with a success message
      return res
        .status(200)
        .json({ message: "Users synced successfully!", data: response.data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error syncing users" });
    }
  } else {
    // If token is invalid, respond with error
    return res.status(403).json({ message: "Forbidden" });
  }
};

export default handler;
