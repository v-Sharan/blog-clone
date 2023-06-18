import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

import { ConnectDB } from "./mongodb/connect.js";
import UserRoutes from "./routes/user.js";
import BlogRoutes from "./routes/blog.js";

dotenv.config();

const app = express();
app.use("/uploads/blogs", express.static(path.join("uploads", "blogs")));
app.use("/uploads/profile", express.static(path.join("uploads", "profile")));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use("/user", UserRoutes);
app.use("/postBlog", BlogRoutes);

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, () => {
      console.log(err);
    });
  }
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  res.status(status).json({ message: message });
});

const startServer = () => {
  try {
    ConnectDB(process.env.MONGODB_URL);
    app.listen(8080, () => {
      console.log("http://localhost:8080");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
