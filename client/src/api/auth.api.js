import axios from "axios";
import { serverUrl } from "../constants";
import {
  signInFailure,
  signInStart,
  signInSuccess,
  signOutSuccess,
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

export const signUp = async (formData) => {
  try {
    const response = await axios.post(`${serverUrl}/api/auth/signup`, formData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (dispatch, user) => {
  try {
    const res = await fetch(`${serverUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: localStorage.getItem("token"),
        "x-client-id": user._id,
      },
    });
    localStorage.removeItem("token");
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to logout user");
    }
    dispatch(signOutSuccess());
    return data;
  } catch (error) {
    console.log(error);
  }
};
