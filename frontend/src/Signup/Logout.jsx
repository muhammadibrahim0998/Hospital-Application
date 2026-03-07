import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    logout();                             // clears role-keyed tokens correctly
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  return null;
}
