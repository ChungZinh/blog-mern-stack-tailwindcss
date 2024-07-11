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
import { useLocation } from "react-router-dom";
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
        <Sidebar.ItemGroup>
          {currentUser.isAdmin && (
            <Sidebar.Item
              active={tab === "dashboard"}
              icon={HiChartPie}
              // label={"User"}
              labelColor="dark"
              href="/dashboard?tab=dashboard"
            >
              Dashboard
            </Sidebar.Item>
          )}
          <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            label={currentUser.isAdmin ? "Admin" : "User"}
            labelColor="dark"
            href="/dashboard?tab=profile"
          >
            Profile
          </Sidebar.Item>
          {currentUser.isAdmin && (
            <Sidebar.Item
              active={tab === "posts"}
              icon={HiDocumentText}
              // label={"User"}
              labelColor="dark"
              href="/dashboard?tab=posts"
            >
              Posts
            </Sidebar.Item>
          )}

          {currentUser.isAdmin && (
            <Sidebar.Item
              active={tab === "users"}
              icon={HiUserGroup}
              // label={"User"}
              labelColor="dark"
              href="/dashboard?tab=users"
            >
              Users
            </Sidebar.Item>
          )}

          {currentUser.isAdmin && (
            <Sidebar.Item
              active={tab === "comments"}
              icon={HiAnnotation}
              // label={"User"}
              labelColor="dark"
              href="/dashboard?tab=comments"
            >
              Comments
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
