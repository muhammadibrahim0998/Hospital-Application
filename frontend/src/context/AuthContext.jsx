import React, { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true until session is restored

  // Map backend roles to the requested storage keys
  // Map backend roles to the requested storage keys
  const getRoleKey = (role) => {
    const r = role?.toLowerCase()?.replace(/_/g, "");
    if (r === "superadmin") return "superadmin";
    if (r === "hospitaladmin") return "hospitaladmin";
    if (r === "labtechnician") return "labtechnician";
    return r; // admin, doctor, patient
  };

  const normalizeRole = (role) => {
    const r = role?.toLowerCase()?.replace(/[-_]/g, "");
    if (r === "superadmin") return "super_admin";
    if (r === "hospitaladmin") return "hospital_admin";
    if (r === "labtechnician") return "lab_technician";
    return r;
  };

  // Detect which role session should be active based on current URL path
  // NOTE: /hospital-admin MUST be checked before /admin to avoid prefix collision
  const detectActiveRole = useCallback(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("/super-admin") || path.includes("/superadmin")) return "super_admin";
    if (path.includes("/hospital-admin") || path.includes("/hospitaladmin")) return "hospital_admin"; // must be before /admin
    if (path.includes("/admin")) return "admin";
    if (path.includes("/doctor/dashboard") || path.includes("doctor-lab")) return "doctor";
    if (path.includes("/patient")) return "patient";
    
    const stored = sessionStorage.getItem("activeRole");
    return stored ? normalizeRole(stored) : null;
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
    const role = normalizeRole(userData.role);
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
    const role = normalizeRole(user.role);
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
    // When storage changes (e.g., doctor logs in Tab B), re-detect role from THIS tab's URL
    const handleStorage = () => {
      const path = window.location.pathname.toLowerCase();
      // Always prioritize URL path to avoid cross-tab session interference
      let roleFromPath = null;
      if (path.includes("/super-admin") || path.includes("/superadmin")) roleFromPath = "super_admin";
      else if (path.includes("/hospital-admin") || path.includes("/hospitaladmin")) roleFromPath = "hospital_admin";
      else if (path.includes("/admin")) roleFromPath = "admin";
      else if (path.includes("/doctor/dashboard") || path.includes("doctor-lab")) roleFromPath = "doctor";
      else if (path.includes("/patient") || path.includes("/lab-results") || path.includes("/find-doctor") || path.includes("/appointments") || path === "/" || path.includes("/doctors") || path.includes("/doctor/")) roleFromPath = "patient";
      
      if (roleFromPath) {
        // Only reload if the stored session for THIS role changed
        loadSession(roleFromPath);
      }
      // If path gives no hint, don't override current session
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasModule }}>
      {children}
    </AuthContext.Provider>
  );
};
