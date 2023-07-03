import { useMutation, useQueryClient } from "react-query";
import blogService from "../services/blogs";
import Blog from "./Blog";

const Blogs = ({ blogs, getBlogs, showBanner }) => {
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

  const removeBlogMutation = useMutation(blogService.removeOne, {
    onSuccess: (_, removedBlog) => {
      const allBlogs = queryClient.getQueryData("blogs");
      const updatedBlogs = allBlogs.filter((blog) => blog.id !== removedBlog);
      queryClient.setQueryData("blogs", updatedBlogs);
      showBanner("green", `blog removed`);
    },
  });

  const likeBlog = (blog) => {
    likeBlogMutation.mutate({ ...blog, likes: blog.likes + 1 });
  };

  const removeBlog = (id) => {
    removeBlogMutation.mutate(id);
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

  return (
    <div>
      {getBlogs.isLoading ? <div>loading...</div> : <div>{showBlogs()}</div>}
    </div>
  );
};

export default Blogs;
