const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("../../models/User");
const auth = require("../../src/middleware/auth");

const router = express.Router();

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "../layouts/home";
  next();
});

router.get("/login", (req, res) => {
  res.render("client/login");
});
//
//

//
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.passwprd
    );
    if (user) {
      const token = await user.genAuthToken();
    }
    res.send(user);
  } catch (e) {
    req.flash("error", e.message);
    res.status(400).redirect("/login");
  }
});
//
router.get("/logout", auth, (req, res) => {
  req.logOut();
  res.redirect("/login");
});
///////////////////////////////////////
router.get("/register", (req, res) => {
  res.render("client/register");
});
////////////////////////////////////////////
const confirm = function (req, res, next) {
  try {
    if (req.body.password !== req.body.passwordConfirm) {
      throw new Error(" pass fields doesn't matched");
    }
    next();
  } catch (err) {
    const error = { error: { message: err.message } };
    res.status(400).render("client/register", {
      errors: error,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });
  }
};
/////////////////////////////////////////////////
router.post("/register", confirm, async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.genAuthToken();
    res.cookie("JWT", token, { maxAge: 1000 * 60 * 60 * 24 });
    req.flash("success_message", `welcome ${req.body.firstName} `);
    res.redirect("/admin");
    // res.send(user);
  } catch (error) {
    res.send(error.message);
    res.status(400).render("client/register", {
      errors: error.errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });
  }
});

module.exports = router;
