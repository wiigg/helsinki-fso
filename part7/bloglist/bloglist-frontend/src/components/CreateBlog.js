import { useMutation } from "react-query";
import { useRef } from "react";

import { useUserValue } from "../contexts/UserContext";
import blogService from "../services/blogs";
import BlogForm from "./BlogForm";
import Toggleable from "./Toggleable";

const CreateBlog = ({ setBlogs, showBanner }) => {
  const loggedInUser = useUserValue();
  const blogFormRef = useRef();

  const createBlog = ({ title, author, url }) => {
    createBlogMutation.mutate({ title, author, url });
  };

  const createBlogMutation = useMutation(blogService.createOne, {
    onSuccess: (createdBlog) => {
      setBlogs((oldBlogs) => oldBlogs.concat({ ...createdBlog, loggedInUser }));
      blogFormRef.current.toggleVisibility();
      showBanner("green", `a new blog ${createdBlog.title} added`);
    },
    onError: () => {
      showBanner("red", "error creating blog");
    },
  });

  if (!loggedInUser) return null;

  return (
    <div>
      <Toggleable buttonLabel="new blog" ref={blogFormRef}>
        <h2>add new</h2>
        <BlogForm createBlog={createBlog} />
      </Toggleable>
      <br />
    </div>
  );
};

export default CreateBlog;
