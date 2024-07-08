import axios from "axios";
import { serverUrl } from "../constants";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
export const oAuth = async (dispatch, formData) => {
  try {
    dispatch(signInStart());
    const response = await axios.post(`${serverUrl}/api/auth/google`, formData);
    console.log("response: ", response.data.data);
    localStorage.setItem("token", response.data.data.token);
    dispatch(signInSuccess(response.data.data.user));
    return response.data.data;
  } catch (error) {
    dispatch(signInFailure(error.message));
    console.log(error);
    return error;
  }
};
