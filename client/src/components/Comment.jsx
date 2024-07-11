import { useEffect, useState } from "react";
import { serverUrl } from "../constants";
import { useSelector } from "react-redux";
import { FaThumbsUp } from "react-icons/fa";
import moment from "moment";

export default function Comment({ comment, onLike }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getUser = async () => {
      if (!comment.userId) {
        console.error("comment.userId is undefined");
        return;
      }

      try {
        const res = await fetch(`${serverUrl}/api/user/${comment.userId._id}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            authorization: localStorage.getItem("token"),
            "x-client-id": currentUser?._id || "",
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }

        setUser(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    getUser();
  }, [comment, currentUser]);

  return (
    <div className="flex p-4 border-b dark:border-teal-500 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 object-cover rounded-full"
          src={user.avatar || "default-avatar-url"} // Provide a default avatar URL if user.avatar is undefined
          alt="user avatar"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user.username ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 pb-2 ">{comment.content}</p>
        <div className="flex items-center pt-2 gap-2 
        border-t border-r-neutral-300 dark:border-teal-500 max-w-fit  ">
          <button
            onClick={() => onLike(comment._id)}
            className={`text-gray-400 hover:text-blue-500 ${
              currentUser &&
              comment.likes.includes(currentUser._id) &&
              "!text-blue-500"
            }`} 
          >
            <FaThumbsUp className="text-sm" />
          </button>
          <p className="text-gray-400 text-xs">
            {comment.numberOfLikes > 0 &&
              comment.numberOfLikes +
                " " +
                (comment.numberOfLikes === 1 ? "like" : "likes")}
          </p>
        </div>
      </div>
    </div>
  );
}
