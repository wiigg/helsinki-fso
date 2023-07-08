import { Link } from "react-router-dom";

const Blogs = ({ blogs }) => {
  const showBlogs = () =>
    blogs &&
    blogs
      .sort((a, b) => b.likes - a.likes)
      .map((blog) => (
        <li key={blog.id} className="mb-4 rounded-md bg-gray-200 p-4 shadow">
          <Link
            to={`/blogs/${blog.id}`}
            className="font-semibold text-gray-800 hover:text-gray-500"
          >
            {blog.title}
          </Link>
        </li>
      ));

  return (
    <div>
      <ul className="mt-4 space-y-4">{showBlogs()}</ul>
    </div>
  );
};

export default Blogs;
