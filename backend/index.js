import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";

import { ConnectDB } from "./mongodb/connect.js";
import UserRoutes from "./routes/user.js";
import BlogRoutes from "./routes/blog.js";

dotenv.config();

const app = express();
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
};
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.json());

// app.use((error, res) => {
//   const status = error.status || 500;
//   const message = error.message || "Something went wrong.";
//   res.status(status).json({ message: message });
// });

app.use("/user/auth", UserRoutes);
app.use("/post/blogs", BlogRoutes);

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
