export const isAdmin = (req, res, next) => {
  const allowedRoles = ["Admin"];
  const userRoles = req.user.roles;

  // Check if the user has the required role
  const hasRequiredRole = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasRequiredRole) {
    return res
      .status(403)
      .json({ message: "Forbidden - Insufficient permissions" });
  }

  next();
};
