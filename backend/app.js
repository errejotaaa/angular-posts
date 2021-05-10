const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const app = express();

mongoose
  .connect(
    "mongodb+srv://errejotaaa:" +
      process.env.MONGO_ATLAS_PWD +
      "@cluster0.nvg1g.mongodb.net/PostsDB?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //not used in this project
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);

module.exports = app;
