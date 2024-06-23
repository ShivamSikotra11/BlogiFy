const mongoose = require("mongoose");
const { randomBytes, createHmac } = require("crypto");
const { createToken } = require("../services/authentication");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Already registered email"],
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = 'blog-shivam-app';
  const hashPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashPassword;
  next();
});

userSchema.statics.matchPasswordAndGenerateToken = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User Not found");
  }

  const salt = user.salt;
  const hashProvidedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  if (hashProvidedPassword !== user.password)
    throw new Error("Incorrect Password");
  const token = createToken(user);
  return token;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
