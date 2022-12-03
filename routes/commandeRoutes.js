const express = require("express");
const router = express.Router();
const commandeController = require("../controllers/commandeController");
const authController = require("../controllers/authController");

//delete commande for current client
router.delete(
  "/:idCommande",
  authController.protect,
  authController.restrictTo("client"),
  commandeController.deleteCommande
);

//get commandes that current employee send a request for it
router.get(
  "/myMessions",
  authController.protect,
  authController.restrictTo("livreur"),
  commandeController.findMessionEmployee
);

//get commandes that current employee send a request for it and he was accepted
router.get(
  "/myNewMessions",
  authController.protect,
  authController.restrictTo("livreur"),
  commandeController.getAllNewMissions
);

//get one commande that current employee send a request for it and he was accepted
router.get(
  "/myNewMessions/:idCommande",
  authController.protect,
  authController.restrictTo("livreur"),
  commandeController.getOneNewMission
);

//get commandes of current client
router.get(
  "/myCommandes",
  authController.protect,
  authController.restrictTo("client"),
  commandeController.getCommandesClient
);

// get all unreached commandes for current client
router.get(
  "/MyUnreachedCommandes",
  authController.protect,
  authController.restrictTo("client"),
  commandeController.findMyUnreachedCommandes
);

// get all reached commandes for current client
router.get(
  "/MyReachedCommandes",
  authController.protect,
  authController.restrictTo("client"),
  commandeController.findMyReachedCommandes
);

// cancel  a request send it from current employee to a commande
router.delete(
  "/cancelReq/:idCommande/:idOffre",
  authController.protect,
  authController.restrictTo("livreur"),
  commandeController.cancelRequestDeleteOffre
);

//get one commande of current Client
router.get(
  "/mycommandes/:idcommande",
  authController.protect,
  authController.restrictTo("client"),
  commandeController.getOneCommandeClient
);

//update commande by current client
router.patch(
  "/:idCommande",
  authController.protect,
  authController.restrictTo("client"),
  commandeController.updateCommande
);

// Send a request to a commande by current employee
router.post(
  "/SendRequest/:idCommande",
  authController.protect,
  authController.restrictTo("livreur"),
  commandeController.sendRequestAndOffreToCommande
);

// Create a new commande
router.post(
  "/",
  authController.protect,
  authController.restrictTo("client"),
  commandeController.createCommande
);

// Retrieve all commandes
router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  commandeController.getAllCommandes
);

// get all open commandes for admin
router.get(
  "/AllOpenCommandes",
  authController.protect,
  authController.restrictTo("admin"),
  commandeController.findAllOpenCommandes
);
// get all open commandes and commandes that curent employee does not send any request to it Bip-Bip App-ClientSide

router.get(
  "/AllUnknowCommandes",
  authController.protect,
  authController.restrictTo("livreur"),
  commandeController.findAllUnknownOpenCommandes
);

// get all close commandes for admin
router.get(
  "/AllCloseCommandes",
  authController.protect,
  authController.restrictTo("admin"),
  commandeController.findAllCloseCommandes
);

// get all reached commandes for admin
router.get(
  "/AllReachedCommandes",
  authController.protect,
  authController.restrictTo("admin"),
  commandeController.findAllReachedCommandes
);

// get all unreached commandes for admin
router.get(
  "/AllUnreachedCommandes",
  authController.protect,
  authController.restrictTo("admin"),
  commandeController.findAllUnreachedCommandes
);

//delete commande for admin
router.delete(
  "/adminDeleteCmmd/:idCommande",
  authController.protect,
  authController.restrictTo("admin"),
  commandeController.deleteCommandeAdmin
);

//Perform an employee to a commande by cuurent client
router.post(
  "/PerformEmp/:idCommande/:idEmp",
  authController.protect,
  authController.restrictTo("client"),
  commandeController.PerformEmployeeToCommande
);

//update condition (reached) of an commande by a currrent employee
router.post(
  "/condition/:idCommande",
  authController.protect,
  authController.restrictTo("livreur"),
  commandeController.changeCommandeCondition
);

// Get one commande for an employee
router.get(
  "/:id",
  authController.protect,
  authController.restrictTo("livreur"),
  commandeController.getOneCommandeForEmp
);

// Get one commande for an admin
router.get(
  "/Administrator/:id",
  authController.protect,
  authController.restrictTo("admin"),
  commandeController.getOneCommandeForAdmn
);

// Rate an employee
router.post(
  "/Review/:idCommande/:idEmp",
  authController.protect,
  authController.restrictTo("client"),
  commandeController.createEmplReview
);

module.exports = router;
