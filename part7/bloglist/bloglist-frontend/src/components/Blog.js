import React, { useState } from "react";

const Blog = ({ blog, likeBlog, removeBlog }) => {
  const [view, setView] = useState(false);
  const [viewMessage, setViewMessage] = useState("view");

  const loggedInUserJSON = window.localStorage.getItem("bloglistUser");
  const username = loggedInUserJSON
    ? JSON.parse(loggedInUserJSON).username
    : null;

  const blogStyle = {
    padding: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const visible = { display: view ? "" : "none" };

  const showView = () => {
    setView(!view);
    setViewMessage(view ? "view" : "hide");
  };

  const handleLike = () => {
    likeBlog(blog);
  };

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog.id);
    }
  };

  const showRemove = {
    display: blog.user.username === username ? "" : "none",
  };

  return (
    <div className="blog" style={blogStyle}>
      {blog.title} {blog.author}{" "}
      <button id="viewButton" onClick={showView}>
        {viewMessage}
      </button>
      <div style={visible}>
        <div id="url">{blog.url}</div>
        <div id="likes">
          likes {blog.likes}{" "}
          <button id="likeButton" onClick={handleLike}>
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
        <div id="removeButton" style={showRemove}>
          <button onClick={handleRemove}>remove</button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
