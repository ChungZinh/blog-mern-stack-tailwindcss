import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { serverUrl } from "../constants";
import { useSelector } from "react-redux";
import PostCard from "../components/PostCard";

export default function Search() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermURL = urlParams.get("searchTerm");
    const sortURL = urlParams.get("sort");
    const categoryURL = urlParams.get("category");
    if (searchTermURL || sortURL || categoryURL) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermURL,
        sort: sortURL || "desc",
        category: categoryURL || "uncategorized",
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`${serverUrl}/api/post/getposts?${searchQuery}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: localStorage.getItem("token"),
          "x-client-id": currentUser._id,
        },
      });
      if (!res.ok) {
        setLoading(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setPosts(data.data.posts);
        setLoading(false);
        if (data.data.posts.length === 9) {
          setShowMore(true);
        }
        setShowMore(false);
      }
    };
    fetchPosts();
  }, [location.search, setSidebarData, currentUser._id]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({
        ...sidebarData,
        searchTerm: e.target.value,
      });
    }
    if (e.target.id === "sort") {
      setSidebarData({
        ...sidebarData,
        sort: e.target.value,
      });
    }
    if (e.target.id === "category") {
      setSidebarData({
        ...sidebarData,
        category: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = new URLSearchParams(location.search);
    url.set("searchTerm", sidebarData.searchTerm);
    url.set("sort", sidebarData.sort);
    url.set("category", sidebarData.category);
    const search = url.toString();
    navigate(`/search?${search}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`${serverUrl}/api/post/getposts?${searchQuery}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: localStorage.getItem("token"),
        "x-client-id": currentUser._id,
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data.posts.length === 9) {
        setShowMore(true);
      }
      setShowMore(false);
      setPosts([...posts, ...data.data.posts]);
    }
  };

  console.log(showMore);
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r md:min-h-screen border-neutral-200">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 items-end">
          <div className="flex items-center gap-2 ">
            <label className="whitespace-nowrap font-semibold ">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              type="text"
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
              className="w-[150px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.sort}
              id="sort"
              className="w-[150px]"
            >
              <option value="desc">Lastest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
              className="w-[150px]"
            >
              <option value="uncategorized">Select a category</option>
              <option value="javascript">JavaScript</option>
              <option value="Reactjs">React.js</option>
              <option value="Nodejs">Node.js</option>
              <option value="expressjs">Express.js</option>
              <option value="mongodb">MongoDB</option>
              <option value="python">Python</option>
              <option value="django">Django</option>
              <option value="flask">Flask</option>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full"
            outline
            gradientDuoTone="purpleToPink"
          >
            Apply Filters
          </Button>
        </form>
      </div>

      <div className="w-full">
        <h2
          className="text-3xl font-semibold sm:border-b
         border-neutral-200 px-4 py-6 "
        >
          Posts Results
        </h2>
        <div className="p-7 flex flex-wrap gap-4 ">
          {!loading && posts.length === 0 && (
            <h2 className="text-2xl font-semibold">No posts found</h2>
          )}
          {loading && <h2 className="text-2xl font-semibold">Loading...</h2>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}

          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-lg hover:underline w-full text-teal-500 text-center"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
