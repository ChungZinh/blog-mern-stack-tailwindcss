import { toast } from "react-toastify";
import { serverUrl } from "../constants";

export const createPost = async (user, formData, navigate) => {
  try {
    const res = await fetch(`${serverUrl}/api/post/create`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: localStorage.getItem("token"),
        "x-client-id": user._id,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create post");
    }
    console.log("data", data);
    toast.success("Post created successfully");
    navigate(`/post/${data.data.slug}`);
    return data.data
  } catch (err) {
    console.error(err); 
    toast.error(err.message || "Failed to create post");
  }
};
