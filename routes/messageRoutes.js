const express = require("express");
const router = express.Router();
const messageController = require("../Controllers/messageController");
const authController = require("../controllers/authController");

// Send a message to admin by current client
router.post(
  "/",
  authController.protect,
  authController.restrictTo("client", "livreur"),
  messageController.sendMessage
);

// Get all messages for admin
router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  messageController.getAllMessages
);

// Get all unread messages for admin
router.get(
  "/unreadMessages",
  authController.protect,
  authController.restrictTo("admin"),
  messageController.getAllUnreadMessage
);

// Get one message for admin
router.get(
  "/:idMessage",
  authController.protect,
  authController.restrictTo("admin"),
  messageController.getOneMessage
);

// delete an message for admin
router.delete(
  "/:idMessage",
  authController.protect,
  authController.restrictTo("admin"),
  messageController.deleteOneMessageAdmin
);

module.exports = router;
