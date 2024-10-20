import { verifyToken } from "@/utils/verifyToken";

const handler = (req, res) => {
  // If the request reached here, it means the token is valid
  res.status(200).json({ message: "Token is valid", user: req.user });
};

// Wrap the handler with the middleware
export default (req, res) => {
  verifyToken(req, res, () => handler(req, res));
};
