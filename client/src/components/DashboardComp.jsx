import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { serverUrl } from "../constants";
import { toast } from "react-toastify";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";
export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/user/getusers`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            authorization: localStorage.getItem("token"),
            "x-client-id": currentUser?._id,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUsers(data.data.users);
          setTotalUsers(data.data.total);
          setLastMonthUsers(data.data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchPosts = async () => {
      if (currentUser && currentUser.isAdmin) {
        try {
          const res = await fetch(`${serverUrl}/api/post/getposts`, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              authorization: localStorage.getItem("token"),
              "x-client-id": currentUser._id,
            },
          });
          const data = await res.json();
          if (res.ok) {
            setPosts(data.data.posts);
            setTotalPosts(data.data.totalPosts);
            setLastMonthPosts(data.data.lastMonthPosts);
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
    const fetchComments = async () => {
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
          if (res.ok) {
            setComments(data.data.comments);
            setTotalComments(data.data.totalComments);
            setLastMonthComments(data.data.commentsLastMonth);
          }
        } catch (error) {
          toast.error("Get posts error");
        }
      }
    };

    fetchComments();
    fetchPosts();
    fetchUsers();
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto table-auto">
      <div className="flex flex-wrap gap-4 justify-center w-full">
        {/* USERS */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-base uppercase">Total User</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiUserGroup
              className="bg-teal-600 text-white 
          rounded-full text-5xl p-3 shadow-lg"
            />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500 ">Last month</div>
          </div>
        </div>

        {/* POSTS */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-base uppercase">Total Post</h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <HiDocumentText
              className="bg-green-600 text-white 
          rounded-full text-5xl p-3 shadow-lg"
            />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500 ">Last month</div>
          </div>
        </div>

        {/* COMMENTS */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-base uppercase">
                Total Comments
              </h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <HiAnnotation
              className="bg-purple-600 text-white 
          rounded-full text-5xl p-3 shadow-lg"
            />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500 ">Last month</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 py-3 mx-auto justify-center">
        {/* USERS */}
        <div className="flex flex-col w-full md:w-auto shadow-lg  p-2 rounded-md dark:bg-slate-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent users</h1>
            <Button outline gradientDuoTone={"purpleToPink"}>
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/profile/${user.username}`}>
                        {user.username}
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        {/* POSTS */}
        <div className="flex flex-col w-full md:w-auto shadow-lg p-2 rounded-md dark:bg-slate-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent post</h1>
            <Button outline gradientDuoTone={"purpleToPink"}>
              <Link to={"/dashboard?tab=posts"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Post Category</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body key={post._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-18 h-14 rounded-md object-cover"
                      />
                    </Table.Cell>
                    <Table.Cell className="w-96">
                      <Link to={`/post/${post.slug}`}>{post.title}</Link>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        {/* COMMENTS */}
        <div className="flex flex-col w-full md:w-auto shadow-lg p-2 rounded-md dark:bg-slate-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent comments</h1>
            <Button outline gradientDuoTone={"purpleToPink"}>
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body key={comment._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="w-96">
                      <p className="line-clamp-2">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
