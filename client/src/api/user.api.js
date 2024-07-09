import { serverUrl } from "../constants";
import {
  updateFailure,
  updateStart,
  updateSuccess,
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
    dispatch(updateSuccess(res.data.data.user));
    return res.data.data;
  } catch (err) {
    dispatch(updateFailure());
  }
};
