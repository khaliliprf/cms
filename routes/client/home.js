const express = require("express");

const Post = require("../../models/Post");
const Category = require("../../models/Category");
const User = require("../../models/User");

const router = express.Router();

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "../layouts/home";
  next();
});
// another method to apply our layout to a view
// router.get("", (req, res) => {
//   res.render("client/index", {
//     layout: "../layouts/home",
//   });
// });
router.get("", async (req, res) => {
  try {
    const posts = await Post.find({});
    const categories = await Category.find({}).limit(4);
    res.render("client/index", { posts, categories });
  } catch (error) {
    res.send(error.message);
  }
});
router.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const categories = await Category.find({}).limit(4);

    res.render("client/post", { post, categories });
  } catch (error) {
    res.send(error.message);
  }
});
//////////////////////////////////
//
router.get("/about", (req, res) => {
  res.render("client/about");
});

module.exports = router;
