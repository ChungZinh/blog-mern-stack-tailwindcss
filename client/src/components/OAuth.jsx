import { Button } from "flowbite-react";
import { FaGoogle } from "react-icons/fa6";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { oAuth } from "../api/oAuth.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      const formData = {
        name: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL,
      };
      const response = await oAuth(dispatch, formData);
      console.log("respone: ", response);
      if (response.user) {
        toast.success("Sign in successfully");
        navigate("/");
      } else {
        toast.error("Sign in error");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      onClick={handleGoogleClick}
      type="button"
      gradientDuoTone="purpleToPink"
      outline
    >
      <FaGoogle className="w-4 h-4 mr-2" />
      Continue with Google
    </Button>
  );
}
