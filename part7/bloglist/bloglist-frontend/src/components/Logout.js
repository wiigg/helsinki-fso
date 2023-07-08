import { useUserDispatch } from "../contexts/UserContext";
import { useAutoDismissNotification } from "../contexts/NotificationContext";

const Logout = () => {
  const userDispatch = useUserDispatch();
  const notify = useAutoDismissNotification();
  const handleLogout = () => {
    userDispatch({ type: "CLEAR_USER" });
    window.localStorage.removeItem("bloglistUser");
    notify("successful log out", "blue");
  };

  return (
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>
  );
};

export default Logout;
