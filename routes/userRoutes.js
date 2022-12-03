const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

//create empl client admin
router.post("/signup", authController.signup);

//login by mdps email
router.post("/login", authController.login);

// Liste of employees who have 5 rate less than 2
router.get(
  "/AllFakeEmployees",
  authController.protect,
  authController.restrictTo("admin"),
  userController.findAllFakeEmployees
);

//liste of user for admin
router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getAllUsers
);

// Liste of all clients for admin
router.get(
  "/AllClients",
  authController.protect,
  authController.restrictTo("admin"),
  userController.findAllClients
);

// Liste of all admins for admin
router.get(
  "/AllAdmins",
  authController.protect,
  authController.restrictTo("admin"),
  userController.findAllAdmins
);

// Liste of all employees for admin
router.get(
  "/AllEmployees",
  authController.protect,
  authController.restrictTo("admin"),
  userController.findAllEmployees
);

//get commandes that current employee send it
router.get(
  "/mySendCommandes",
  authController.protect,
  authController.restrictTo("livreur"),
  userController.findSendCommandes
);

//get profil by current user
router.get(
  "/me",
  authController.protect,
  //  req.user.id and put it in req.params.id
  userController.getMe,
  userController.getUserById
);

//get user by id for admin
router.get(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getUserById
);

//get employee by id for current client
router.get(
  "/getEmp/:id",
  authController.protect,
  authController.restrictTo("client"),
  userController.getEmpById
);

//update user
router.patch("/:id", authController.protect, userController.updateUser);

//delete user
router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  userController.deleteUser
);

module.exports = router;
