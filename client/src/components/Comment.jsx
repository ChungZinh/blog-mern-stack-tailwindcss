import { useEffect, useState } from "react";
import { serverUrl } from "../constants";
import { useSelector } from "react-redux";
import moment from "moment";
export default function Comment({ comment }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    try {
      const getUser = async () => {
        const res = await fetch(`${serverUrl}/api/user/${comment.userId._id}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            authorization: localStorage.getItem("token"),
            "x-client-id": currentUser._id,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        setUser(data.data);
      };
      getUser();
    } catch (error) {
      console.log(error);
    }
  }, [comment]);
  return (
    <div className="flex p-4 border-b dark:border-teal-500 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 object-cover rounded-full"
          src={user.avatar}
          alt="image user"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 pb-2 ">{comment.content}</p>
      </div>
    </div>
  );
}
