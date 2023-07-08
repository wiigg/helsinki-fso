import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserDispatch } from "../contexts/UserContext";
import { useAutoDismissNotification } from "../contexts/NotificationContext";
import loginService from "../services/login";
import blogService from "../services/blogs";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const userDispatch = useUserDispatch();
  const notify = useAutoDismissNotification();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const currentUser = await loginService.login({ username, password });

      userDispatch({ type: "SET_USER", payload: currentUser });
      window.localStorage.setItem("bloglistUser", JSON.stringify(currentUser));
      blogService.setToken(currentUser.token);

      setUsername("");
      setPassword("");

      notify("successful login", "info");
      navigate("/");
    } catch (exception) {
      notify("wrong username or password", "error");
    }
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-sm">
      <form
        onSubmit={handleLogin}
        className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
      >
        <div className="mb-4">
          <label
            className="mb-2 block text-sm font-bold text-gray-700"
            htmlFor="username"
          >
            username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label
            className="mb-2 block text-sm font-bold text-gray-700"
            htmlFor="password"
          >
            password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            id="loginButton"
            type="submit"
            className="focus:shadow-outline hover:bg-redx-700 rounded bg-red-500 px-4 py-2 font-bold text-white focus:outline-none"
          >
            sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
