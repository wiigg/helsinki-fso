const User = ({ user }) => {
  if (!user) return null;
  return (
    <div className="px-8 pb-8 pt-6">
      <h2 className="mb-4 text-2xl font-semibold">{user.name}</h2>
      <h3 className="mb-2 text-lg font-semibold">Added blogs</h3>
      <ul className="list-disc pl-5">
        {user.blogs.map((blog) => (
          <li key={blog.id} className="mb-2 text-gray-700">
            {blog.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
