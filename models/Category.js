const mongoose = require("mongoose");
const Post = require("./Post");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },
    counter: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);
categorySchema.virtual("posts", {
  ref: "Post",
  localField: "name",
  foreignField: "category",
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
