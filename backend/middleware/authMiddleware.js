import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  // Handle 'Bearer <token>' format
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verify Error:", err.message);
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("Decoded Token:", decoded);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.userRole ? req.userRole.toLowerCase() : "";
    const allowedRoles = roles.map(r => r.toLowerCase());
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
};
