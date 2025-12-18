const allowRoles = (...roles) => {                 // This is REST operator it allows you to pass any number of roles:
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied "
      });
    }
    next();
  };
};

export default allowRoles;
