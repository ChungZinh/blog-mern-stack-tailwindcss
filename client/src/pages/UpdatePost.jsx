import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../constants";
import { toast } from "react-toastify";

export default function UpdatePost() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
  const [formData, setFormData] = useState({});
  const { postId } = useParams();

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(
          `${serverUrl}/api/post/getposts?postId=${postId}`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              authorization: localStorage.getItem("token"),
              "x-client-id": currentUser._id,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.data.message);
          return;
        }
        if (res.ok) {
          setFormData(data.data.posts[0]);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [currentUser]);

  const handleUploadImage = async () => {
    try {
      if (!file) return;
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadingProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFileUploadingError(
            "Could not upload image (File must be than 2MB)",
            error
          );
          setImageFileUploadingProgress(null);
          setFile(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageFileUploadingError("Image upload failed", error);
      setImageFileUploadingProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch(`${serverUrl}/api/post/update/${postId}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            authorization: localStorage.getItem("token"),
            "x-client-id": currentUser._id,
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
        return data.data;
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Failed to create post");
      }
  };
  return (
    <div className="p-3 lg:max-w-6xl md:max-w-3xl  mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Update a post
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            id="category"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="Reactjs">React.js</option>
            <option value="Nodejs">Node.js</option>
            <option value="expressjs">Express.js</option>
            <option value="mongodb">MongoDB</option>
            <option value="python">Python</option>
            <option value="django">Django</option>
            <option value="flask">Flask</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-neutral-400 border-dotted p-3">
          <FileInput
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size={"sm"}
            outline
            onClick={handleUploadImage}
            disabled={imageFileUploadingProgress}
          >
            {imageFileUploadingProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageFileUploadingProgress}
                  text={`${imageFileUploadingProgress}`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
          {imageFileUploadingError && (
            <Alert color={"failure"}>{imageFileUploadingError}</Alert>
          )}
        </div>
        {formData.image && (
          <img
            src={formData.image}
            alt="image"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          placeholder="Write something amazing..."
          className="h-96 mb-12"
          required
          onChange={(v) => setFormData({ ...formData, content: v })}
          value={formData.content}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" size={"lg"}>
          Update Post
        </Button>
      </form>
    </div>
  );
}
