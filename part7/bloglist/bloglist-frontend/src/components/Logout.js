import { useUserDispatch } from "../contexts/UserContext";
import { useAutoDismissNotification } from "../contexts/NotificationContext";

const Logout = () => {
  const userDispatch = useUserDispatch();
  const notify = useAutoDismissNotification();
  const handleLogout = () => {
    userDispatch({ type: "CLEAR_USER" });
    window.localStorage.removeItem("bloglistUser");
    notify("successful log out", "info");
  };

  return (
    <form onSubmit={handleLogout}>
      <button
        type="submit"
        className="rounded bg-yellow-500 px-4 py-1 text-white hover:bg-yellow-600"
      >
        logout
      </button>
    </form>
  );
};

export default Logout;
