import { useMutation } from "react-query";
import { useRef } from "react";

import { useUserValue } from "../contexts/UserContext";
import { useAutoDismissNotification } from "../contexts/NotificationContext";
import blogService from "../services/blogs";
import BlogForm from "./BlogForm";
import Toggleable from "./Toggleable";

const CreateBlog = ({ setBlogs }) => {
  const loggedInUser = useUserValue();
  const blogFormRef = useRef();

  const notify = useAutoDismissNotification();

  const createBlog = ({ title, author, url }) => {
    createBlogMutation.mutate({ title, author, url });
  };

  const createBlogMutation = useMutation(blogService.createOne, {
    onSuccess: (createdBlog) => {
      setBlogs((oldBlogs) => oldBlogs.concat({ ...createdBlog, loggedInUser }));
      blogFormRef.current.toggleVisibility();
      notify(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        "success"
      );
    },
    onError: () => {
      notify("could not create blog", "error");
    },
  });

  if (!loggedInUser) return null;

  return (
    <div className="mb-4 mt-4">
      <Toggleable buttonLabel="new blog" ref={blogFormRef}>
        <h2 className="mb-4 text-2xl font-semibold">Add new</h2>
        <BlogForm createBlog={createBlog} />
      </Toggleable>
    </div>
  );
};

export default CreateBlog;
