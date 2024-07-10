const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const PostController = require("../controllers/post.controller");

router.use(require("../auth/authUtils").verifyToken);
router.post("/create", asyncHandler(PostController.create));
router.get('/getposts', asyncHandler(PostController.getAll))
router.delete('/delete/:id', asyncHandler(PostController.delete));
router.put('/update/:id', asyncHandler(PostController.update));
module.exports = router;
