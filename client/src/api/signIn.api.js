import axios from "axios";
import { serverUrl } from "../constants";
import { signInSuccess, signInStart, signInFailure } from "../redux/user/userSlice";

export const signIn = async (dispatch, formData) => {
  try {
    dispatch(signInStart());

    const response = await axios.post(`${serverUrl}/api/auth/signin`, formData);
    localStorage.setItem("token", response.data.data.token);
    dispatch(signInSuccess(response.data.data.user));

    return response.data.data;

  } catch (error) {
    dispatch(signInFailure(error.message));
    console.log(error);
    return error;
  }
};
