import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase"; // Ensure to import your firebase app configuration

export const uploadImage = async (
  imageFile,
  setImageFileUploadingProgress,
  setImageFileUploadingError,
  setImageFile,
  setImageFileUrl,
  setFormData,
  formData
) => {
  const storage = getStorage(app);
  const fileName = new Date().getTime() + imageFile.name;
  const storageRef = ref(storage, fileName);
  const uploadTask = uploadBytesResumable(storageRef, imageFile);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setImageFileUploadingProgress(progress.toFixed(0));
    },
    (error) => {
      setImageFileUploadingError(
        "Could not upload image (File must be than 2MB)",
        error
      );
      setImageFileUploadingProgress(null);
      setImageFile(null);
      setImageFileUrl(null);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImageFileUrl(downloadURL);
        setFormData({ ...formData, image: downloadURL });
      });
    }
  );
};
