import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { serverUrl } from "../constants";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
export default function PostPage() {
  const { currentUser } = useSelector((state) => state.user);
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${serverUrl}/api/post/getposts?slug=${postSlug}`,
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
        if (!res.ok) {
          setError(true);
          setLoading(false);
          throw new Error(data.message);
        }
        if (res.ok) {
          setPost(data.data.posts[0]);
          toast.success(data.message);
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
        setError(error.message);
      }
    };
    fetchPost();
  }, [postSlug]);
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  return (
    <main className="p-3 flex flex-col lg:max-w-6xl md:max-w-3xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl ">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color={"gray"} pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div
        className="flex justify-between mt-4 items-center p-3 border-b
       border-neutral-300 w-full lg:max-w-6xl md:max-w-3xl text-xs mx-auto dark:border-teal-300"
      >
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: post && post.content }}
        className="p-3 lg:max-w-6xl md:max-w-3xl mx-auto w-full post-content"
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>

      <CommentSection postId={post && post._id} />
    </main>
  );
}
