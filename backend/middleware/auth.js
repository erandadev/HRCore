const jwt = require("jsonwebtoken");

const authorize = (requiredRole) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token)
        return res
          .status(401)
          .json({ message: "Unauthorized", message: "No token found" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Role Check
      if (
        requiredRole &&
        req.user.role !== requiredRole &&
        req.user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Forbidden: You don't have access to this" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid Token" });
    }
  };
};

module.exports = authorize;
