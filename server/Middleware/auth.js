import jwt from "jsonwebtoken";
import { FailureResponse } from "../Helper/helper.js";

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return FailureResponse(res, 'Token not provided', null, 401)
    }
    const token = authHeader.split(" ")[1];
    console.log("parsed token -------------", token);

    if (!token) {
        return FailureResponse(res, 'Malformed Token', null, 401)
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return FailureResponse(res, "Internal Server Error", null, 500);
  }
};