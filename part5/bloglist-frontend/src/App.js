import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Create from "./components/Create";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const [colour, setColour] = useState(null);
  const [message, setMessage] = useState(null);

  // useEffect(() => {
  //   blogService.getAll().then((blogs) => setBlogs(blogs));
  // }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("bloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      fetchBlogs();
    }
  }, []);

  // Only retrieve blogs for signed in users
  const fetchBlogs = async () => {
    const blogs = await blogService.getAll();
    setBlogs(blogs);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      setUser(user);
      window.localStorage.setItem("bloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);

      fetchBlogs();

      setUsername("");
      setPassword("");

      setColour("green");
      setMessage("successful login");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (exception) {
      setColour("red");
      setMessage("wrong username or password");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    setColour("blue");
    setMessage("successful log out");
    setTimeout(() => {
      setMessage(null);
    }, 5000);
    window.localStorage.removeItem("bloglistUser");
  };

  const showBlogs = () =>
    blogs.map((blog) => <Blog key={blog.id} blog={blog} />);

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      // only create if user is logged in
      if (user) {
        await blogService.createOne({ title, author, url });

        setColour("green");
        setMessage(`${title} by ${author} added!`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);

        setTitle("");
        setAuthor("");
        setUrl("");

        fetchBlogs();
      }
    } catch (exception) {
      setColour("red");
      setMessage("could not add blog");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      <h1>blogs</h1>
      <Notification message={message} colour={colour} />
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
          <div>
            Welcome, <b>{user.name}</b>
            <Logout handleLogout={handleLogout} />
            <br />
          </div>
          <div>
            <h2>add new</h2>
            <Create
              handleCreate={handleCreate}
              title={title}
              setTitle={setTitle}
              author={author}
              setAuthor={setAuthor}
              url={url}
              setUrl={setUrl}
            />
            <br />
          </div>
          <div>{showBlogs()}</div>
        </div>
      )}
    </div>
  );
};

export default App;
