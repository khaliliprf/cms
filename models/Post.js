const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
// mongoose.Schema.Types.ObjectId

const postSchema = new Schema(
  {
    // user: {
    //   type: ObjectId,
    //   type: mongoose.Schema.Types.ObjectId,
    // },
    title: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    status: {
      type: String,
      default: "public",
    },
    allowComments: {
      type: Boolean,
      // required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      // type: mongoose.Schema.Types.Buffer,
      type: Buffer,
      defualt: "../public/uploads/default-image.jpg",
    },
    hasImage: {
      type: Boolean,
    },
    category: {
      type: String,
      trim: true,
      ref: "Category",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
postSchema.methods.toJSON = function () {
  const post = this;
  const postObj = post.toObject();
  // delete postObj._id;
  return postObj;
};
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
