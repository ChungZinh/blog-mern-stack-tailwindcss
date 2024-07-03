import axios from "axios";
import { serverUrl } from "../constants";
export const signUp = async (formData) => {
  try {
    const response = await axios.post(`${serverUrl}/api/auth/signup`, formData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
