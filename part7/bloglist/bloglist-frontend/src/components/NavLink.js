import { Link } from "react-router-dom";

const NavLink = ({ to, children }) => (
  <Link
    className="text-gray-300 hover:text-white transition-colors"
    to={to}
  >
    {children}
  </Link>
);

export default NavLink;
