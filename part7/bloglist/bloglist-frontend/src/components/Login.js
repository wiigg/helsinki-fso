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

      notify("successful login", "blue");
      navigate("/");
    } catch (exception) {
      notify("wrong username or password", "red");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        username{" "}
        <input
          id="username"
          type="text"
          value={username}
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password{" "}
        <input
          id="password"
          type="password"
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="loginButton" type="submit">
        login
      </button>
    </form>
  );
};

export default Login;
