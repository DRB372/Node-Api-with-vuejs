const express = require("express");
const { body } = require("express-validator");

const indexController = require("../controllers/index");

const router = express.Router();

// GET /index/posts
router.get("/posts", indexController.getPosts);

// POST /index/post
router.post(
  "/post",
  [
    body("linkName").trim().isLength({ min: 5 }).escape(),
    body("description").trim().isLength({ min: 5 }).escape(),
    body("notes").trim().isLength({ min: 5 }).escape(),
    body("url").trim().isLength({ min: 5 }).escape(),
    body("topicID").trim().isLength({ min: 5 }).escape()
  ],
  indexController.createPost
);

router.get("/post/:postId", indexController.getPost);

router.put(
  "/post/:postId",
  [
    body("linkName").trim().isLength({ min: 5 }).escape(),
    body("description").trim().isLength({ min: 5 }).escape(),
    body("notes").trim().isLength({ min: 5 }).escape(),
    body("url").trim().isLength({ min: 5 }).escape(),
    body("topicID").trim().isLength({ min: 5 }).escape()
  
  ],
  indexController.updatePost
);
router.delete('/post/:postId', indexController.deletePost);
module.exports = router;
