import { useUserDispatch } from "../contexts/UserContext";

const Logout = ({ showBanner }) => {
  const userDispatch = useUserDispatch();
  const handleLogout = () => {
    userDispatch({ type: "CLEAR_USER" });
    window.localStorage.removeItem("bloglistUser");
    showBanner("blue", "successful log out");
  };

  return (
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>
  );
};

export default Logout;
