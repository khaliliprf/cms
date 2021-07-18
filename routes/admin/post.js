const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const Post = require("../../models/Post");
const Category = require("../../models/Category");
const auth = require("../../src/middleware/auth");

const router = express.Router();
// //

// router.all("/*", auth);
// read posts
router.get("/", auth, async (req, res) => {
  try {
    if (!req.query) {
      const posts = await Post.find({});
      res.render("admin/posts/index", { posts: posts });
    } else {
      const k = {};
      k[Object.keys(req.query)[0]] = req.query[Object.keys(req.query)[0]];
      const posts = await Post.find({}).sort(k);
      res.render("admin/posts/index", {
        posts: posts,
        sort: req.query[Object.keys(req.query)[0]],
      });
    }
  } catch (error) {
    res.status(400).send(error.messsage);
  }
});
//sort based on last update
//
//get post image
router.get("/:id/image", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || !post.image) {
      throw new Error("No IMAGE");
    }
    res.set("Content-Type", "image/png");
    res.send(post.image);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
//create post page
router.get("/create", auth, async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("admin/posts/create", { categories });
  } catch (error) {
    res.send(error.message);
  }
});

//
// const uploadImage = multer({
//   limits: 10000000,
//   fileFilter(req, file, cb) {
//     console.log("multer");
//     cb(null, true);
//   },
// });

//configure dislStorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  // fileFilter(req, file, cb) {
  //   const buffer = await sharp();
  // },
});
//create post
router.post("/create", auth, upload.single("file"), async (req, res) => {
  try {
    // set up allowComment to boolean
    if (req.body.allowComments) {
      req.body.allowComments = true;
    } else {
      req.body.allowComments = false;
    }
    // validation
    const errors = [];
    if (!req.body.title) {
      errors.push({ message: "please add a title" });
    }
    if (!req.body.body) {
      errors.push({ message: "please add a description" });
    }

    if (errors.length > 0) {
      res.render("admin/posts/create", { errors: errors });
    }
    const post = new Post(req.body);
    if (req.file) {
      // modifying input file to specific size
      post.image = await sharp(req.file.buffer)
        .resize({ height: 500, width: 900 })
        .png()
        .toBuffer();
      post.hasImage = true;
    } else {
      post.image = await sharp("./public/uploads/default-image.png")
        .resize({ height: 500, width: 900 })
        .png()
        .toBuffer();
      post.hasImage = true;
    }
    //save post
    await post.save();

    if (req.body.category) {
      const category = await Category.findOne({ name: req.body.category });
      category.counter++;
      category.save();
    }
    // display flash message
    req.flash(
      "success_message",
      `post ${req.body.title} was created successfully`
    );
    // res.send(req.body);
    res.status(201).redirect("/admin/posts");
  } catch (error) {
    res.status(400);
  }
});
//
router.get("/edit/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  // const categories = Category.where("name").;
  const categories = await Category.where("name").ne(post.category);
  res.render("admin/posts/edit", { post, categories });
});
// edit Post
router.put("/edit/:id", auth, upload.single("file"), async (req, res) => {
  try {
    if (req.body.allowComments) {
      req.body.allowComments = true;
    } else {
      req.body.allowComments = false;
    }

    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    if (req.file) {
      post.image = await sharp(req.file.buffer)
        .resize({ height: 500, width: 900 })
        .png()
        .toBuffer();
      post.hasImage = true;
      post.save();
    }
    if (!post) {
      res.status(404).send("something wrong");
    }
    req.flash(
      "success_message",
      `post ${post.title} was updated successfully!`
    );
    res.status(202).redirect("/admin/posts");
  } catch (error) {
    res.status(404).send(error.message);
  }
});
// delete
router.delete("/delete/:id", auth, async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  req.flash("success_message", `post ${post.title} was deleted successfully!`);
  res.redirect("/admin/posts");
});

module.exports = router;
