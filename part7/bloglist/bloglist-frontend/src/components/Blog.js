import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";

import blogService from "../services/blogs";
import { useAutoDismissNotification } from "../contexts/NotificationContext";
import Comments from "./Comments";

const Blog = ({ blog }) => {
  const queryClient = useQueryClient();
  const notify = useAutoDismissNotification();

  const likeBlogMutation = useMutation(blogService.incrementLike, {
    onSuccess: (updatedBlog) => {
      const allBlogs = queryClient.getQueryData("blogs");
      const updatedBlogs = allBlogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      );
      queryClient.setQueryData("blogs", updatedBlogs);
      notify(`you liked ${updatedBlog.title}`, "green")
    },
  });

  const handleLike = () => {
    likeBlogMutation.mutate({ ...blog, likes: blog.likes + 1 });
  };

  if (!blog) return null;

  return (
    <div className="blog">
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div id="url">
        <Link to={`${blog.url}`}>{blog.url}</Link>
      </div>
      <div id="likes">
        {blog.likes} likes
        <button id="likeButton" onClick={handleLike}>
          like
        </button>
      </div>
      <div>added by {blog.user.name}</div>
      <Comments blog={blog} />
    </div>
  );
};

export default Blog;
