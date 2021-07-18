const express = require("express");
const auth = require("../../src/middleware/auth");

const router = express.Router();
const Category = require("../../models/Category");

router.all("/*", auth);

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "../layouts/admin";
  next();
});

//create page
router.get("/", auth, async (req, res) => {
  try {
    const cat = await Category.findOne({ name: "node.js" })
      .populate("posts")
      .exec();
    const categories = await Category.find({});
    res.render("admin/categories/index", {
      categories: categories,
    });
  } catch (error) {
    res.send(error.message);
  }
});
//create
router.post("/create", auth, async (req, res) => {
  try {
    const check = await Category.find(req.body);

    if (check.length) {
      throw new Error("Category Name Already Exist");
    }
    const category = new Category(req.body);
    await category.save();
    res.redirect("/admin/categories");
  } catch (error) {
    const categories = await Category.find({});
    res.render("admin/categories/index", {
      categories: categories,
      error: error.message,
    });
  }
});
//edit page
router.get("/edit/:id", auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    const categories = await Category.find({});
    // console.log(category);
    res.render("admin/categories/index", {
      category: category,
      categories: categories,
    });
  } catch (error) {
    res.send(error.message);
  }
});
// edit
router.put("/edit/:id", auth, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        //   new: true,
      }
    );
    await category.save();
    const categories = await Category.find({});
    console.log(categories);
    res.render("admin/categories/index", {
      categories: categories,
    });
  } catch (error) {
    res.send(error.message);
  }
});
//delete
router.delete("/:id", auth, async (req, res) => {
  try {
    await Category.findByIdAndDelete({ _id: req.params.id });
    res.redirect("/admin/categories");
  } catch (error) {
    res.send(error.message);
  }
});
module.exports = router;
