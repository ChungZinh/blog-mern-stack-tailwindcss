import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { serverUrl } from "../constants";
import { toast } from "react-toastify";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Comment from "./Comment";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser._id) {
      toast.error("You must be signed in to comment");
      return;
    }
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
          postId: postId,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setComment("");
        toast.success(data.message);
        setComments([data.data, ...comments]);
        getComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Comment error");
    }
  };

  const getComments = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/comment/get/${postId}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: localStorage.getItem("token"),
          "x-client-id": currentUser?._id,
        },
      });

      const data = await res.json();
      setComments(data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (postId) {
      getComments();
    }
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser || !currentUser._id) {
        toast.error("You must be signed in to like a comment");
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`${serverUrl}/api/comment/like/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          authorization: localStorage.getItem("token"),
          "x-client-id": currentUser._id,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setComments(
          comments.map((c) =>
            c._id === commentId
              ? {
                  ...c,
                  likes: data.data.likes,
                  numberOfLikes: data.data.numberOfLikes,
                }
              : c
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Like error");
    }
  };

  const handleEdit = async (comment, editedComment) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedComment } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`${serverUrl}/api/comment/delete/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          authorization: localStorage.getItem("token"),
          "x-client-id": currentUser._id,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.filter((c) => c._id !== commentId));
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
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
        <div>
          You must be signed in to comment.
          <Link to={"/sign-in"}>Sign In</Link>
        </div>
      )}
      {currentUser && (
        <form
          className="border border-neutral-300 dark:border-teal-500 rounded-md p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment..."
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
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-2">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((c) => (
            <Comment
              key={c._id}
              comment={c}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
              onLike={handleLike}
              onEdit={handleEdit}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <HiOutlineExclamationCircle className="text-5xl text-red-500 mx-auto" />
          <p className="text-center text-gray-500 mt-4">
            Are you sure you want to delete this comment ?
          </p>
          <div className="flex justify-between mt-5">
            <Button
              color="failure"
              onClick={() => handleDelete(commentToDelete)}
            >
              Yes, I'm sure
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
