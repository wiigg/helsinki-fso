import { Link } from "react-router-dom";

const Blogs = ({ blogs }) => {
  const showBlogs = () =>
    blogs &&
    blogs
      .sort((a, b) => b.likes - a.likes)
      .map((blog) => (
        <li key={blog.id} className="mb-4 p-4 rounded-md shadow-lg bg-white hover:bg-gray-100">
          <Link
            to={`/blogs/${blog.id}`}
            className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition duration-200"
          >
            {blog.title}
          </Link>
          <p className="text-gray-500 mt-2">by {blog.author}</p>
        </li>
      ));

  return (
    <div>
      <ul className="space-y-4">{showBlogs()}</ul>
    </div>
  );
};

export default Blogs;
