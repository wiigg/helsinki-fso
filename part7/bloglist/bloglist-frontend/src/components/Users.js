import { Link } from "react-router-dom";
import { useUserValue } from "../contexts/UserContext";

const Users = ({ users }) => {
  const loggedInUser = useUserValue();
  if (!loggedInUser) return null;
  return (
    <div className="px-8 pb-8 pt-6">
      <h2 className="mb-4 text-2xl font-semibold">Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th></th>
              <th className="px-4 py-3">blogs created</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {users &&
              users.map((user) => (
                <tr key={user.id} className="text-gray-700">
                  <td className="px-4 py-3">
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                  </td>
                  <td className="px-4 py-3">{user.blogs.length}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
