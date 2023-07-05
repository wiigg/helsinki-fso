import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";

import blogService from "../services/blogs";

const Blog = ({ blog, showBanner }) => {
  const queryClient = useQueryClient();

  const likeBlogMutation = useMutation(blogService.incrementLike, {
    onSuccess: (updatedBlog) => {
      const allBlogs = queryClient.getQueryData("blogs");
      const updatedBlogs = allBlogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      );
      queryClient.setQueryData("blogs", updatedBlogs);
      showBanner("green", `you liked ${updatedBlog.title}`);
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
      <h3>comments</h3>
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
