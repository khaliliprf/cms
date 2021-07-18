const jsonwebtoken = require("jsonwebtoken");
const User = require("../../models/User");

const auth = async (req, res, next) => {
  try {
    if (!req.cookies.JWT) {
      throw new Error();
    }
    const decode = jsonwebtoken.verify(req.cookies.JWT, process.env.SECRET);
    const user = await User.findById({
      _id: decode._id,
      "tokens.token": req.cookies.JWT,
    });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (e) {
    req.flash("error", "please authenticate!");
    res.status(401).redirect("/login");
  }
};
module.exports = auth;
