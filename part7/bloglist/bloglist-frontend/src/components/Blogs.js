import { Link } from "react-router-dom";
import { useUserValue } from "../contexts/UserContext";

const Blogs = ({ blogs }) => {
  const loggedInUser = useUserValue();
  if (!loggedInUser) return null;

  const blogStyle = {
    padding: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const showBlogs = () =>
    blogs &&
    blogs
      .sort((a, b) => b.likes - a.likes)
      .map((blog) => (
        <li key={blog.id} style={blogStyle}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </li>
      ));

  return <div>{showBlogs()}</div>;
};

export default Blogs;
