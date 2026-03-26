import React, { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true until session is restored

  // Map backend roles to the requested storage keys
  const getRoleKey = (role) => {
    const r = role?.toLowerCase();
    if (r === "super_admin") return "superadmin";
    if (r === "hospital_admin") return "hospitaladmin";
    return r; // admin, doctor, patient
  };

  // Detect which role session should be active based on current URL path
  // NOTE: /hospital-admin MUST be checked before /admin to avoid prefix collision
  const detectActiveRole = useCallback(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("/super-admin")) return "super_admin";
    if (path.includes("/hospital-admin")) return "hospital_admin"; // must be before /admin
    if (path.includes("/admin")) return "admin";
    if (path.includes("/doctor")) return "doctor";
    if (path.includes("/patient")) return "patient";
    return sessionStorage.getItem("activeRole");
  }, []);

  const refreshAuth = useCallback(() => {
    const activeRole = detectActiveRole();
    if (!activeRole) {
      // If no path match, check if ANY session exists (first found wins as default)
      const allRoles = ["super_admin", "hospital_admin", "admin", "doctor", "patient"];
      const foundRole = allRoles.find(r => localStorage.getItem(`${getRoleKey(r)}_token`));

      if (foundRole) {
        loadSession(foundRole);
      } else {
        // Default to guest patient if no session found
        setUser({ name: "Guest Patient", role: "patient" });
        setToken(null);
        setLoading(false);
      }
      return;
    }
    loadSession(activeRole);
  }, [detectActiveRole]);

  const loadSession = (role) => {
    const key = getRoleKey(role);
    const sToken = localStorage.getItem(`${key}_token`);
    const sUser = localStorage.getItem(`${key}_user`);

    if (sToken && sUser) {
      try {
        const parsedUser = JSON.parse(sUser);
        setToken(sToken);
        setUser(parsedUser);
        sessionStorage.setItem("activeRole", role);
      } catch (e) {
        console.error("Session load error", e);
        setUser(null);
        setToken(null);
      }
    } else {
      setUser({ name: "Guest Patient", role: "patient" });
      setToken(null);
    }
    setLoading(false); // session restore complete
  };

  const login = (userData, userToken) => {
    const role = userData.role.toLowerCase();
    const key = getRoleKey(role);

    localStorage.setItem(`${key}_token`, userToken);
    localStorage.setItem(`${key}_user`, JSON.stringify(userData));
    sessionStorage.setItem("activeRole", role);

    setToken(userToken);
    setUser(userData);
    setLoading(false); // session is live — stop spinner, allow routes to render
  };

  const logout = () => {
    const role = user?.role?.toLowerCase();
    if (role) {
      const key = getRoleKey(role);
      localStorage.removeItem(`${key}_token`);
      localStorage.removeItem(`${key}_user`);
    }
    sessionStorage.removeItem("activeRole");
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const hasModule = (moduleName) => {
    if (!user) return false;
    const role = user.role?.toLowerCase();
    if (role === "super_admin") return true;
    if (role === "hospital_admin") {
      const mods = user.modules || {};
      return mods[moduleName] === true;
    }
    return true;
  };

  useEffect(() => {
    refreshAuth();
    // Re-check auth on navigation or storage events
    window.addEventListener("storage", refreshAuth);
    return () => window.removeEventListener("storage", refreshAuth);
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasModule }}>
      {children}
    </AuthContext.Provider>
  );
};
