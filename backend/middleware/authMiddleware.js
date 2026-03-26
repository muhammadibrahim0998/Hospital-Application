import jwt from "jsonwebtoken";

/**
 * verifyToken
 * Decodes JWT and attaches userId, userRole, hospitalId, hospitalAdminId to req.
 * Works for: super_admin, hospital_admin, doctor, patient.
 */
export const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });

  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verify Error:", err.message);
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.userCnic = decoded.cnic || null;
    req.hospitalId = decoded.hospitalId || null;       // for hospital_admin & scoped users
    req.hospitalAdminId = decoded.hospitalAdminId || null;  // for hospital_admin JWT
    next();
  });
};

/**
 * authorizeRoles(...roles)
 * Checks req.userRole against the allowed list.
 * Case-insensitive. super_admin passes ALL role checks.
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.userRole ? req.userRole.toLowerCase() : "";
    const allowedRoles = roles.map((r) => r.toLowerCase());

    // super_admin bypasses all role restrictions
    if (userRole === "super_admin") return next();

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
};

/**
 * requireSuperAdmin
 * Only allows super_admin role.
 */
export const requireSuperAdmin = (req, res, next) => {
  const role = req.userRole ? req.userRole.toLowerCase() : "";
  if (role !== "super_admin") {
    return res.status(403).json({ message: "Super Admin access required" });
  }
  next();
};

/**
 * requireHospitalAdmin
 * Allows hospital_admin or super_admin.
 */
export const requireHospitalAdmin = (req, res, next) => {
  const role = req.userRole ? req.userRole.toLowerCase() : "";
  if (role !== "hospital_admin" && role !== "super_admin") {
    return res.status(403).json({ message: "Hospital Admin access required" });
  }
  next();
};

/**
 * scopeToHospital
 * For hospital_admin routes: ensures they can only access their own hospital's data.
 * Attaches req.scopedHospitalId for use in controllers.
 * Super Admin bypasses this and can pass ?hospitalId= param to query any hospital.
 */
export const scopeToHospital = (req, res, next) => {
  const role = req.userRole ? req.userRole.toLowerCase() : "";

  if (role === "super_admin") {
    // Super admin can explicitly query a specific hospital or all
    req.scopedHospitalId = req.query.hospitalId ? parseInt(req.query.hospitalId) : null;
    return next();
  }

  if (role === "hospital_admin" || role === "doctor" || role === "admin" || role === "lab_technician") {
    if (!req.hospitalId) {
      return res.status(403).json({ message: "Hospital binding missing from token" });
    }
    req.scopedHospitalId = req.hospitalId;
    return next();
  }

  return res.status(403).json({ message: "Access denied" });
};
