import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const jwtMiddleware = (req, res, next) => {
  // Get the token from the request header
  const token = req.header("Authorization");

  // Check if token exists
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  try {
    const jwtToken = token.split(" ")[1];
    // Verify the token
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    // Attach the decoded user information to the request object
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};
