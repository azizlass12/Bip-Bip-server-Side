const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const offreController = require("../Controllers/offreController");

// get one offre by current client
router.get(
  "/getOneOffre/:idOffre",
  authController.protect,
  authController.restrictTo("client"),
  offreController.findOneOffre
);

// get unread offre by current client
router.get(
  "/GetOffres",
  authController.protect,
  authController.restrictTo("client"),
  offreController.getAllUnreadOffre
);

// get one offre by admin
router.get(
  "/Administrator/:idOffre",
  authController.protect,
  authController.restrictTo("admin"),
  offreController.findOneOffreAdmin
);

// get all send offres by current employee
router.get(
  "/",
  authController.protect,
  authController.restrictTo("livreur"),
  offreController.myOffres
);

// get one offre by current employee
router.get(
  "/:idOffre",
  authController.protect,
  authController.restrictTo("livreur"),
  offreController.getMyOneOffre
);

// get all offres of an specific commande by current client
router.get(
  "/request/:idCommande",
  authController.protect,
  authController.restrictTo("client"),
  offreController.findOffresCommande
);

// get all offres of an specific commande for admin
router.get(
  "/AdministratorCommande/:idCommande",
  authController.protect,
  authController.restrictTo("admin"),
  offreController.findOffresCommandeForAdmin
);

//update an offre by a currrent employee
router.patch(
  "/:idOffre",
  authController.protect,
  authController.restrictTo("livreur"),
  offreController.updateOneOffre
);

module.exports = router;
