const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const user = decodedToken.user;
    req.auth = {
      user: user,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
