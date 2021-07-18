const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "email address is required"],
      unique: [true, "email already taken. please login"],
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Not a valid email address");
        }
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "password should be longer than 8 character"],
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
//
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("unable to login");
  }
  const matched = bcryptjs.compare(password, user.password);
  if (!matched) {
    throw new Error("unable ti login");
  }
  return user;
};
//
userSchema.methods.genAuthToken = async function () {
  const user = this;
  //sign(payload,secret phrase)
  const token = jsonwebtoken.sign(
    { _id: user._id.toString() },
    process.env.SECRET
  );
  // save generated token in the token array
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
//document middleware so this refer to documment
//hash the plain text pass before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcryptjs.hash(user.password, 8);
  }
  next();
});

userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "owner",
});

const User = mongoose.model("User", userSchema);
module.exports = User;
