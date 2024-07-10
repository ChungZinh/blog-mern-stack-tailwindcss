import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { serverUrl } from "../constants";
import { toast } from "react-toastify";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashPost() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);

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

  return (
    <div
      className="table-auto overflow-x-scroll md:mx-auto p-3 
    scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-500 dark:scrollbar-track-slate-700 "
    >
      {currentUser.isAdmin && posts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
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
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                >
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-20 object-cover"
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
                    <span className="font-medium text-red-500 hover:underline cursor-pointer ">
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
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
    </div>
  );
}
