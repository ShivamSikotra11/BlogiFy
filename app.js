require('dotenv').config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

const Blog = require('./models/blog');

const { checkForAuthenticationCookie } = require("./middlewares/authMiddleWare");

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors(
  {
    origin:["https://blogi-fy-three.vercel.app/","http://localhost:8000"],
    methods:["GET","POST"],
    credentials:true
  }
));
mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(() => console.log("MongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware to handle form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this line to parse JSON bodies
app.use(cookieParser());
app.use(checkForAuthenticationCookie('BlogAppToken'));
// bydeault public ni andar ni vastu ne as a route manse express to tene keva ke te badhu routes nahi static files che we use this
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs:allBlogs,
  });
});

// Register the routes
app.use("/user", userRoutes);
app.use("/blog", blogRoutes); // Correct usage

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
