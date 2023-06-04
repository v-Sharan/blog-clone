import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export const checkToken = (req, res, next) => {
  let token;
  const AuthToken = req.headers.authorization || req.headers.Authorization;

  if (AuthToken && AuthToken.startsWith("Bearer")) {
    token = AuthToken.split(" ")[1];
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      if (err) {
        return res.status(401).json({ message: "Invalid token." });
      }
      req.decoded = decoded;
      next();
    });
  }
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }
};

export const sessionToken = (token) => {
  const session = jwt.verify(token, process.env.SECRET);
  if (session.exp !== 0) {
    return true;
  }
};
