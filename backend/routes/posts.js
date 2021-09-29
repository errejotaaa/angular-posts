const express = require("express");

const postsController = require("../controllers/posts");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

router.post("", checkAuth, extractFile, postsController.createPost);

router.get("", postsController.getPosts);

router.get("/:id", postsController.getPost);

router.put("/:id", checkAuth, extractFile, postsController.updatePost);

router.delete("/:id", checkAuth, postsController.deletePost);

module.exports = router;
