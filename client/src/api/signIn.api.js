import axios from "axios";
import { serverUrl } from "../constants";
export const signIn = async (formData) => {
  try {
    const response = await axios.post(`${serverUrl}/api/auth/signin`, formData);
    const data = response.data.data;
    localStorage.setItem('token', data.token)
    return data;
  } catch (error) {
    console.log(error);
  }
};
