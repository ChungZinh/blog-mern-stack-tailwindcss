import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../components/DashSideBar";
import DashProfile from "../components/DashProfile";
import DashPost from "../components/DashPost";
import DashUser from "../components/DashUser";
import DashComments from "../components/DashComments";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-72">
        {/* SIDEBAR */}
        <DashSideBar />
      </div>
      {/* PROFILE */}
      {tab === "profile" && <DashProfile />}
      {/* POSTS */}
      {tab === "posts" && <DashPost />}
      {/* USERS */}
      {tab === "users" && <DashUser />}
      {/* COMMENTS */}
      {tab == "comments" && <DashComments />}
    </div>
  );
}
