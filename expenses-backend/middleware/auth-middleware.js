require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader == process.env.API_KEY) {
    next();
  } else {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthenticatedError("No token provided");
    }
    const token = authHeader.split(" ")[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = { userId: payload.userId, name: payload.name };
      next();
    } catch (error) {
      throw new UnauthenticatedError(
        "You must be logged in to access this route"
      );
    }
  }
};

module.exports = authenticationMiddleware;
