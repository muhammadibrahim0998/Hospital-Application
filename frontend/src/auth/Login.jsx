import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginAsUser = () => {
    login("user");
    navigate("/user");
  };

  const loginAsAdmin = () => {
    login("admin");
    navigate("/admin");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>
      <button onClick={loginAsUser}>Login as User</button>
      <br />
      <br />
      <button onClick={loginAsAdmin}>Login as Admin</button>
    </div>
  );
};

export default Login;
