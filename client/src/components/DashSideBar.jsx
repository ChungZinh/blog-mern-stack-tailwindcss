import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiAnnotation,
  HiArrowSmRight,
  HiChartPie,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
  HiUserGroup,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../api/auth.api";

export default function DashSideBar() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  const location = useLocation();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleLogout = async () => {
    await logout(dispatch, currentUser);
  };
  return (
    <Sidebar className="w-full md:w-72">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="gap-4">
          {currentUser.isAdmin && (
            <Sidebar.Item icon={HiChartPie} labelColor="dark">
              <Link to={"/dashboard?tab=dashboard"}>Dashboard</Link>
            </Sidebar.Item>
          )}
          <Sidebar.Item
            icon={HiUser}
            label={currentUser.isAdmin ? "Admin" : "User"}
            labelColor="dark"
          >
            <Link to={"/dashboard?tab=profile"}>Profile</Link>
          </Sidebar.Item>

          {currentUser.isAdmin && (
            <Sidebar.Item icon={HiDocumentText} labelColor="dark">
              <Link to={"/dashboard?tab=posts"}>Posts</Link>
            </Sidebar.Item>
          )}

          {currentUser.isAdmin && (
            <Sidebar.Item icon={HiUserGroup} labelColor="dark">
              <Link to={"/dashboard?tab=users"}>Users</Link>
            </Sidebar.Item>
          )}

          {currentUser.isAdmin && (
            <Sidebar.Item icon={HiAnnotation} labelColor="dark">
              <Link to={"/dashboard?tab=comments"}>Comments</Link>
            </Sidebar.Item>
          )}

          <Sidebar.Item
            // active
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleLogout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
