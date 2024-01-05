const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).send({ msg: `Token required` });
  }

  try {
    const decoded = jwt.verify(token, "nyka");
    req.body.username = decoded.username;
    req.body.userID = decoded.userID;
    next();
  } catch (err) {
    return res.status(400).json({ msg: "Invalid Token" });
  }
};

module.exports = { auth };
