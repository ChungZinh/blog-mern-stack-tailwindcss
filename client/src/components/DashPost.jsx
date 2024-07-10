import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { serverUrl } from "../constants";
import { toast } from "react-toastify";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { deletePost } from "../api/post.api";

export default function DashPost() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postId, setPostId] = useState("");
  useEffect(() => {
    const fetchPosts = async () => {
      if (currentUser && currentUser.isAdmin) {
        try {
          const res = await fetch(
            `${serverUrl}/api/post/getposts?userId=${currentUser._id}`,
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
            setPosts(data.data.posts);
            if (data.data.posts.length < 9) {
              setShowMore(false);
            }
            toast.success("Get posts successfully");
            console.log("posts:", posts);
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
    const startIndex = posts.length;
    try {
      const res = await fetch(
        `${serverUrl}/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`,
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
        setPosts((prev) => [...prev, ...data.data.posts]);
        if (data.data.posts.length < 9) {
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
      const res = await fetch(`${serverUrl}/api/post/delete/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          authorization: localStorage.getItem("token"),
          "x-client-id": currentUser._id,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post._id !== postId));
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
      {currentUser.isAdmin && posts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md ">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="">
              {posts.map((post) => (
                <Table.Row
                  key={post._id}
                  className="bg-white divide-y dark:divide-teal-500 divide-neutral-200 h-28 duration-300 dark:border-gray-700 dark:bg-gray-800 "
                >
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-15 object-cover"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostId(post._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer "
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline  cursor-pointer"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
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
        <p>You have no posts yet!</p>
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
            Are you sure you want to delete this post ?
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
