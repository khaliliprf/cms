const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const faker = require("faker");

const auth = require("../../src/middleware/auth");

// apply our admin layout to all routes on this router object
router.all("/*", (req, res, next) => {
  req.app.locals.layout = "../layouts/admin";
  // The app.locals object has properties that are local variables within the application
  next();
});

//define routes
router.get("", auth, (req, res) => {
  try {
    res.render("admin/index");
  } catch (error) {
    res.send(error.message);
  }
});
router.post("/gen-fake-post", auth, async (req, res) => {
  try {
    for (let i = 1; i <= req.body.number; i++) {
      const ran = Math.trunc(Math.random() * 3);
      const stats = ["private", "public", "draft"];
      const post = new Post({
        title: faker.name.title(),
        status: stats[ran],
        allowComments: faker.datatype.boolean(),
        body: faker.lorem.sentence(),
      });
      await post.save();
    }
    res.redirect("/admin/posts");
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
