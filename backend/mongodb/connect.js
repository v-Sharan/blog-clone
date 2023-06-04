import mongoose from "mongoose";

export function ConnectDB(url) {
  mongoose
    .connect(url)
    .then(() => {
      console.log("MongoDb Connected");
    })
    .catch((err) => {
      console.log(err);
    });
}
