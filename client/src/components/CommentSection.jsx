import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { serverUrl } from "../constants";
import { toast } from "react-toastify";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${serverUrl}/api/comment/create`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: localStorage.getItem("token"),
          "x-client-id": currentUser._id,
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setComment("");
        toast.success(data.message);
      }
    } catch (error) {
      toast.error("Comment error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.avatar}
            alt=""
          />
          <Link
            className="text-xs text-cyan-600 hover:underline"
            to={"/dashboard?tab=profile"}
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="">
          You must be signed in to commet.
          <Link to={"/sign-in"}>Sign In</Link>
        </div>
      )}
      {currentUser && (
        <form
          className="border border-neutral-300 dark:border-teal-500 rounded-md p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a commet..."
            rows="3"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            maxLength={"200"}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone={"purpleToBlue"} type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
