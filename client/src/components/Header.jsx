import {
  Avatar,
  Button,
  Dropdown,
  Navbar,
  TextInput,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { logout } from "../api/auth.api";
import { useEffect, useState } from "react";
export default function Header() {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermURL = urlParams.get("searchTerm");
    if (searchTermURL) {
      setSearchTerm(searchTermURL);
    }
  }, [location.search]);

  const handleLogout = async () => {
    await logout(dispatch, currentUser);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = new URLSearchParams(location.search);
    url.set("searchTerm", searchTerm);
    const search = url.toString();
    navigate(`/search?${search}`);
  };
  return (
    <div>
      <Navbar className="border-b-2">
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm md:text-xl font-semibold dark:text-white"
        >
          <span className="px-2.5 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Dev
          </span>
          Blog
        </Link>
        <form onSubmit={handleSubmit}>
          <TextInput
            className="hidden lg:inline"
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <Button className="w-12 h-10 lg:hidden" color={"gray"}>
          <AiOutlineSearch size={18} />
        </Button>
        <div className="flex items-center gap-2 md:order-2">
          <Button
            className="w-12 h-10 hidden sm:inline"
            color="gray"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </Button>
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar alt="avatar" src={currentUser.avatar} rounded />}
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.username}</span>
                {/* <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span> */}
              </Dropdown.Header>
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <Button gradientDuoTone={"purpleToBlue"}>Sign In</Button>
            </Link>
          )}

          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
            <Link to={"/"}>Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={"div"}>
            <Link to={"/about"}>About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/projects"} as={"div"}>
            <Link to={"/projects"}>Projects</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
