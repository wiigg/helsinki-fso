import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Routes, Route, useMatch, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Logout from "./components/Logout";
import Notification from "./components/Notification";
import Users from "./components/Users";
import User from "./components/User";
import Blogs from "./components/Blogs";
import Blog from "./components/Blog";
import CreateBlog from "./components/CreateBlog";
import NavLink from "./components/NavLink";
import blogService from "./services/blogs";
import userService from "./services/users";
import { useUserDispatch, useUserValue } from "./contexts/UserContext";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const userDispatch = useUserDispatch();
  const user = useUserValue();

  const getBlogs = useQuery("blogs", blogService.getAll, {
    enabled: !!user,
    retry: 1,
  });

  const getUsers = useQuery("users", userService.getAll, {
    enabled: !!user,
    retry: 1,
  });

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem("bloglistUser");
    if (loggedInUserJSON) {
      const currentUser = JSON.parse(loggedInUserJSON);
      userDispatch({ type: "SET_USER", payload: currentUser });
      blogService.setToken(currentUser.token);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (getUsers.data) {
      setUsers(getUsers.data);
    }
  }, [getUsers.data]);

  useEffect(() => {
    if (getBlogs.data) {
      setBlogs(getBlogs.data);
    }
  }, [getBlogs.data]);

  const userMatch = useMatch("/users/:id");
  const userToShow = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null;

  const blogMatch = useMatch("/blogs/:id");
  const blogToShow = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null;

  if (loading) return <div>loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between bg-gray-800 px-6 py-4">
        <h1 className="text-2xl font-semibold text-white">Blog App</h1>

        <div className="flex items-center space-x-4">
          <NavLink to="/">blogs</NavLink>
          <NavLink to="/users">users</NavLink>
          <div className="flex items-center gap-1">
            {user ? (
              <>
                <span className="text-gray-300">{user.name}</span>
                <Logout />
              </>
            ) : (
              <NavLink to="/login">login</NavLink>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto my-4 max-w-5xl">
        <Notification />

        <Routes>
          <Route
            path="/users/:id"
            element={
              user ? (
                <User user={userToShow} />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route
            path="/users"
            element={
              user ? <Users users={users} /> : <Navigate replace to="/login" />
            }
          />
          <Route
            path="/blogs/:id"
            element={
              user ? (
                <Blog blog={blogToShow} />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              user ? (
                <>
                  <CreateBlog setBlogs={setBlogs} />
                  <Blogs blogs={blogs} getBlogs={getBlogs} />
                </>
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
