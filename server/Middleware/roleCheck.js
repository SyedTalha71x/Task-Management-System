import jwt from "jsonwebtoken";
import User from "../Models/credientials-schema.js";
import { FailureResponse } from "../Helper/helper.js";

export const roleCheck = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.header("Authorization");
      console.log("Authorization Header:", authHeader);
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return FailureResponse(res, 'Token not provided', null, 401);
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return FailureResponse(res, 'Malformed Token', null, 401);
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);

      const user = await User.findById(decoded.userId);
      console.log("User in Middleware:", user);

      if (!user) {
        return FailureResponse(res, 'User not found', null, 404);
      }

      if (!allowedRoles.includes(user.role)) {
        return FailureResponse(res, 'Access denied', null, 403);
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error in roleCheck Middleware:", error);
      return FailureResponse(res, 'Internal Server Error', null, 500);
    }
  };
};

