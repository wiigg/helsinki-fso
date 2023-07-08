import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Routes, Route, useMatch, Link, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Logout from "./components/Logout";
import Notification from "./components/Notification";
import Users from "./components/Users";
import User from "./components/User";
import Blogs from "./components/Blogs";
import Blog from "./components/Blog";
import CreateBlog from "./components/CreateBlog";
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

  const navStyle = {
    padding: 5,
    marginRight: "0.25em",
  };

  if (loading) return <div>loading...</div>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.1em",
          backgroundColor: "lightgrey",
        }}
      >
        <Link style={navStyle} to="/">
          blogs
        </Link>
        <Link style={navStyle} to="/users">
          users
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.1em" }}>
          {user ? (
            <>
              <em style={navStyle}>{user.name} logged in</em>
              <Logout />
            </>
          ) : (
            <Link style={navStyle} to="/login">
              login
            </Link>
          )}
        </div>
      </div>
      <h1>blog app</h1>
      <Notification />

      <Routes>
        <Route
          path="/users/:id"
          element={
            user ? <User user={userToShow} /> : <Navigate replace to="/login" />
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
            user ? <Blog blog={blogToShow} /> : <Navigate replace to="/login" />
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
  );
};

export default App;
