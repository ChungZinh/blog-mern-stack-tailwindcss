import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signUp } from "../api/signUp.api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return setErrorMessage("Plese fill out all fields.");
    }
    setLoading(true);
    try {
      const response = signUp(formData);
      toast.success("Sign up successfully");
      setLoading(false);
      console.log(response);
    } catch (error) {
      console.log(error);
      setLoading(true);
      toast.error("Sign up error");
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-semibold dark:text-white text-4xl">
            <span className="px-2.5 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Dev
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5 ">
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="email@gmail.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Confirm password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="confirmPassword"
                onChange={handleChange}
              />
            </div>
            <Button
              disabled={loading}
              gradientDuoTone="purpleToPink"
              type="submit"
            >
              {loading ? (
                <div>
                  {" "}
                  <Spinner size="sm" />
                  <span className="pl-3"> Loading...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="flex gap-2 text-sm mt-4">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Login
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
