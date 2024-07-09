import { serverUrl } from "../constants";
import {
  updateFailure,
  updateStart,
  updateSuccess,
  deleteFailure,
  deleteStart,
  deleteSuccess,
} from "../redux/user/userSlice";

export const updateUser = async (dispatch, user, formData) => {
  dispatch(updateStart());
  try {
    const res = await fetch(`${serverUrl}/api/user/update/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        authorization: localStorage.getItem("token"),
        "x-client-id": user._id,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update user");
    }
    dispatch(updateSuccess(data.data));
    return data.data;
  } catch (err) {
    console.error(err);
    dispatch(updateFailure());
  }
};

export const deleteUser = async (dispatch, user) => {
  dispatch(deleteStart());
  try {
    const res = await fetch(`${serverUrl}/api/user/delete/${user._id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        authorization: localStorage.getItem("token"),
        "x-client-id": user._id,
      },
    });
    // remove token from local storage
    localStorage.removeItem("token");
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete user");
    }
    dispatch(deleteSuccess());
    return data ? true : false;
  } catch (error) {
    console.error(error);
    dispatch(deleteFailure());
  }
};
