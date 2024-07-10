import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { serverUrl } from "../constants";
import { toast } from "react-toastify";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUser() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const fetchPosts = async () => {
      if (currentUser && currentUser.isAdmin) {
        try {
          const res = await fetch(`${serverUrl}/api/user/getusers`, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              authorization: localStorage.getItem("token"),
              "x-client-id": currentUser._id,
            },
          });
          const data = await res.json();
          console.log("data:", data.data.users);
          if (res.ok) {
            setUsers(data.data.users);
            if (data.data.users.length < 9) {
              setShowMore(false);
            }
            toast.success("Get posts successfully");
            console.log("posts:", users);
          } else {
            toast.error("Get posts error");
          }
        } catch (error) {
          toast.error("Get posts error");
        }
      }
    };

    fetchPosts();
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(
        `${serverUrl}/api/user/getusers?userId=${currentUser._id}&startIndex=${startIndex}`,
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
        setUsers((prev) => [...prev, ...data.data.users]);
        if (data.data.users.length < 9) {
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
      const res = await fetch(`${serverUrl}/api/user/delete/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          authorization: localStorage.getItem("token"),
          "x-client-id": currentUser._id,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
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
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md ">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="">
              {users.map((user) => (
                <Table.Row
                  key={user._id}
                  className="bg-white divide-y dark:divide-teal-500 divide-neutral-200 h-28 duration-300 dark:border-gray-700 dark:bg-gray-800 "
                >
                  <Table.Cell>
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-14 h-14 bg-gray-500 rounded-full object-cover"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck  className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserId(user._id);
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
        <p>You have no users yet!</p>
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
