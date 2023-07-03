import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Routes, Route, useMatch } from "react-router-dom";

import Login from "./components/Login";
import Logout from "./components/Logout";
import Notification from "./components/Notification";
import Users from "./components/Users";
import User from "./components/User";
import Blogs from "./components/Blogs";
import CreateBlog from "./components/CreateBlog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import userService from "./services/users";
import { useNotificationDispatch } from "./contexts/NotificationContext";
import { useUserDispatch, useUserValue } from "./contexts/UserContext";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);

  const notificationDispatch = useNotificationDispatch();
  const userDispatch = useUserDispatch();
  const user = useUserValue();

  const getBlogs = useQuery("blogs", blogService.getAll, {
    enabled: !!user,
  });

  const getUsers = useQuery("users", userService.getAll, {
    enabled: !!user,
    retry: 1,
  });

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

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem("bloglistUser");
    if (loggedInUserJSON) {
      const currentUser = JSON.parse(loggedInUserJSON);
      userDispatch({ type: "SET_USER", payload: currentUser });
      blogService.setToken(currentUser.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const currentUser = await loginService.login({ username, password });

      userDispatch({ type: "SET_USER", payload: currentUser });
      window.localStorage.setItem("bloglistUser", JSON.stringify(currentUser));
      blogService.setToken(currentUser.token);

      setUsername("");
      setPassword("");

      showBanner("blue", "successful log in");
    } catch (exception) {
      showBanner("red", "wrong username or password");
    }
  };

  const handleLogout = () => {
    userDispatch({ type: "CLEAR_USER" });
    window.localStorage.removeItem("bloglistUser");
    showBanner("blue", "successful log out");
  };

  const showBanner = (colour, message) => {
    notificationDispatch({
      type: "SET_NOTIFICATION",
      payload: { colour, message },
    });
    setTimeout(() => {
      notificationDispatch({ type: "HIDE_NOTIFICATION" });
    }, 5000);
  };

  const userMatch = useMatch("/users/:id");
  const userToShow = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null;

  return (
    <div>
      <h1>blogs</h1>
      <Notification />
      {!user && (
        <Login
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      )}
      {user && (
        <div>
          Welcome, <b>{user.name}</b>
          <Logout handleLogout={handleLogout} />
          <br />
        </div>
      )}

      <Routes>
        <Route path="/users/:id" element={<User user={userToShow} />} />
        <Route path="/users" element={<Users users={users} />} />
        <Route
          path="/"
          element={
            <>
              <CreateBlog getBlogs={getBlogs} showBanner={showBanner} />
              <Blogs
                blogs={blogs}
                getBlogs={getBlogs}
                showBanner={showBanner}
              />
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
