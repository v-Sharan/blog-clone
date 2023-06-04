import axios from "axios";
import * as dotenv from "dotenv";

import { HttpError } from "./HttpError.js";

dotenv.config();

export const getUserDeatils = async (token) => {
  const options = {
    method: "GET",
    url: process.env.GOOGLE_API_URL,
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.request(options);

    const { email, name, picture } = response.data;
    return { email, name, picture };
  } catch (error) {
    throw new HttpError("Authorization faild try to signup again", 401);
  }
};
