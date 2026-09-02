const admin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Access denied, only admin can access" });
  }
};

module.exports = { admin };