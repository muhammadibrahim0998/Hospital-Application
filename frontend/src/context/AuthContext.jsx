import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  /**
   * Helper — returns TRUE if the current user has a specific module enabled.
   * super_admin always returns true.
   * hospital_admin checks their modules object from the JWT payload.
   * Other roles always return true (modules don't apply).
   */
  const hasModule = (moduleName) => {
    if (!user) return false;
    const role = user.role?.toLowerCase();
    if (role === "super_admin") return true;
    if (role === "hospital_admin") {
      const mods = user.modules || {};
      return mods[moduleName] === true;
    }
    return true; // doctors, patients, etc. aren't module-gated
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasModule }}>
      {children}
    </AuthContext.Provider>
  );
};
