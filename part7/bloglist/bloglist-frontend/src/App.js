import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Notification from "./components/Notification";
import Toggleable from "./components/Toggleable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { useNotificationDispatch } from "./contexts/NotificationContext";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();
  const notificationDispatch = useNotificationDispatch();

  const queryClient = useQueryClient();

  const getBlogs = useQuery("blogs", blogService.getAll, {
    enabled: !!user,
  });

  const createBlogMutation = useMutation(blogService.createOne, {
    onSuccess: (createdBlog) => {
      setBlogs((oldBlogs) => oldBlogs.concat({ ...createdBlog, user }));
      blogFormRef.current.toggleVisibility();
      showBanner("green", `a new blog ${createdBlog.title} added`);
    },
  });

  const likeBlogMutation = useMutation(blogService.incrementLike, {
    onSuccess: (updatedBlog) => {
      const allBlogs = queryClient.getQueryData("blogs");
      console.log(updatedBlog);
      const updatedBlogs = allBlogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      );
      queryClient.setQueryData("blogs", updatedBlogs);
      showBanner("green", `you liked ${updatedBlog.title}`);
    },
  });

  const removeBlogMutation = useMutation(blogService.removeOne, {
    onSuccess: (_, removedBlog) => {
      const allBlogs = queryClient.getQueryData("blogs");
      const updatedBlogs = allBlogs.filter((blog) => blog.id !== removedBlog);
      queryClient.setQueryData("blogs", updatedBlogs);
      showBanner("green", `blog removed`);
    },
  });

  useEffect(() => {
    if (getBlogs.data) {
      setBlogs(getBlogs.data);
    }
  }, [getBlogs.data]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("bloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      setUser(user);
      window.localStorage.setItem("bloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);

      setUsername("");
      setPassword("");

      showBanner("blue", "successful log in");
    } catch (exception) {
      showBanner("red", "wrong username or password");
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("bloglistUser");
    showBanner("blue", "successful log out");
  };

  const showBlogs = () =>
    blogs &&
    blogs
      .map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          removeBlog={removeBlog}
        />
      ))
      .sort((a, b) => b.props.blog.likes - a.props.blog.likes);

  const createBlog = ({ title, author, url }) => {
    createBlogMutation.mutate({ title, author, url });
    return true;
  };

  const likeBlog = (blog) => {
    likeBlogMutation.mutate({ ...blog, likes: blog.likes + 1 });
    return true;
  };

  const removeBlog = (id) => {
    removeBlogMutation.mutate(id);
    return true;
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
          <div>
            Welcome, <b>{user.name}</b>
            <Logout handleLogout={handleLogout} />
            <br />
          </div>
          <div>
            <Toggleable buttonLabel="new blog" ref={blogFormRef}>
              <h2>add new</h2>
              <BlogForm createBlog={createBlog} showBanner={showBanner} />
            </Toggleable>
            <br />
          </div>
          {getBlogs.isLoading ? (
            <div>loading...</div>
          ) : (
            <div>{showBlogs()}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
