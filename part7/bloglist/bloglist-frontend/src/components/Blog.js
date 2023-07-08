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
      notify(`you liked ${updatedBlog.title}`, "success");
    },
    onError: () => {
      notify("could not like blog", "error");
    },
  });

  const handleLike = () => {
    likeBlogMutation.mutate({ ...blog, likes: blog.likes + 1 });
  };

  if (!blog) return null;

  return (
    <div className="blog m-4 mx-auto max-w-lg overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
      <div className="md:flex">
        <div className="p-8">
          <h2 className="mb-2 text-2xl font-semibold">
            {blog.title} by {blog.author}
          </h2>
          <div id="url" className="mb-4">
            <Link to={`${blog.url}`} className="text-blue-500 hover:underline">
              {blog.url}
            </Link>
          </div>
          <div id="likes" className="mb-4 flex items-center">
            {blog.likes} likes
            <button
              id="likeButton"
              onClick={handleLike}
              className="ml-2 rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              like
            </button>
          </div>
          <div className="text-gray-600">added by {blog.user.name}</div>
        </div>
      </div>
      <Comments blog={blog} />
    </div>
  );
};

export default Blog;
