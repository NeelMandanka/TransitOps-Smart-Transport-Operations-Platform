// Mirrors PAGE_ACCESS from the original app: pass the roles allowed to hit a route.
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Your role does not have access to this module" });
    }
    next();
  };
}
