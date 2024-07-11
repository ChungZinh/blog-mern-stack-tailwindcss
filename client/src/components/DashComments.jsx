import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { serverUrl } from "../constants";
import { toast } from "react-toastify";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentId, setCommentId] = useState("");
  useEffect(() => {
    const fetchCommnets = async () => {
      if (currentUser && currentUser.isAdmin) {
        try {
          const res = await fetch(`${serverUrl}/api/comment/get`, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              authorization: localStorage.getItem("token"),
              "x-client-id": currentUser?._id,
            },
          });
          const data = await res.json();
          console.log("data:", data.data);
          setComments(data.data.comments);
        } catch (error) {
          toast.error("Get posts error");
        }
      }
    };

    fetchCommnets();
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `${serverUrl}/api/comment/get?userId=${currentUser._id}&startIndex=${startIndex}`,
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
      if (res.ok) {
        setComments((prev) => [...prev, ...data.data]);
        if (data.data.length < 9) {
          setShowMore(false);
        }
        toast.success("Get posts successfully");
      } else {
        toast.error("Get posts error");
      }
    } catch (error) {
      toast.error("Get posts error");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/comment/delete/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          authorization: localStorage.getItem("token"),
          "x-client-id": currentUser._id,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => prev.filter((user) => user._id !== commentId));
        setShowModal(false);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div
      className="table-auto overflow-x-scroll md:mx-auto p-3  w-full
    scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-500 dark:scrollbar-track-slate-700 "
    >
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md ">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Commnet content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="">
              {comments.map((comment) => (
                <Table.Row
                  key={comment._id}
                  className="bg-white divide-y dark:divide-teal-500 divide-neutral-200 h-16 duration-300 dark:border-gray-700 dark:bg-gray-800 "
                >
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentId(comment._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer "
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no comment yet!</p>
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
            Are you sure you want to delete this user ?
          </p>
          <div className="flex justify-between mt-5">
            <Button color="failure" onClick={handleDelete}>
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
