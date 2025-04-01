const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const postController = require("../controllers/postController");

// استخدم middleware واحد فقط للمصادقة
router.use(authMiddleware);

// استخدم مجموعة واحدة من المسارات
// الحصول على جميع منشورات المستخدم والإنشاء
router
  .route("/")
  .get(postController.getUserPosts)
  .post(postController.createPost);

// الحذف وتبديل التفضيل
router.route("/:id").delete(postController.deletePost);

// مسار منفصل للتفضيل
router.patch("/:id/favorite", postController.toggleFavorite);

module.exports = router;
