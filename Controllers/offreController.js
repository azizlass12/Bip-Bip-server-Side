const Offre = require("../models/offreModel");
const User = require("../models/userModel");
const Commande = require("../models/commandeModel");

// get all offres maked by current employee
exports.myOffres = async (req, res) => {
  try {
    // Test if there is offres
    const offres = await Offre.find({ LivreurID: req.user.id }).populate(
      "CommandeID"
    );
    // Test if employee have no offres send
    if (offres.length == 0) {
      return res.status(400).send({ message: "vous n'avez pas d'offres !! " });
    }
    return res.status(200).json({
      status: "succès",
      offres,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      err,
    });
  }
};

// Get one offre by current employee
exports.getMyOneOffre = async (req, res, next) => {
  try {
    // Test if there is an offre
    const offre = await Offre.findById(req.params.idOffre);
    if (!offre) {
      return res.status(400).send({
        message: "Aucune offre avec cette id !! ",
      });
    }
    // Test if employee is the responsible of offre
    if (offre.LivreurID == req.user.id) {
      return res.status(200).json({
        status: "succès",
        offre,
      });
    }
    return res.status(404).json({
      status: "Vous n'êtes pas responsable de cette offre !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

// get all offres of an specific commande by current client
exports.findOffresCommande = async (req, res) => {
  try {
    // Test if there is a commande
    const commande = await Commande.findById(req.params.idCommande).populate(
      "offres"
    );
    let offres = commande.offres;
    // Test if current client have no offres
    if (offres.length == 0) {
      return res.status(400).send({ message: "vous n'avez pas d'offres !! " });
    }
    // Test if current client is the owner of commande
    if (commande.utilisateurID == req.user.id) {
      return res.status(200).json({
        status: "succès",
        offres,
      });
    }
    return res
      .status(400)
      .send({ message: "vous n'êtes pas responsable de cette commande !! " });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      err,
    });
  }
};

// Get all unread offres for current client
exports.getAllUnreadOffre = async (req, res, next) => {
  try {
    // Test if there is offres
    const offres = await Offre.find({
      étéLu: false,
      ClientID: req.user.id,
    }).populate("LivreurID");
    if (offres) {
      return res.status(200).json({
        status: "succès",
        result: offres.length,
        data: {
          offres,
        },
      });
    }
    return res.status(404).json({
      status: "vous n'avez pas d'offres !!",
      data: err,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};
// get one offre by current client
exports.findOneOffre = async (req, res) => {
  try {
    // Test if there is an offre
    const offre = await Offre.findById(req.params.idOffre).populate(
      "LivreurID"
    );
    if (!offre) {
      return res.status(400).send({
        message: "Aucune offre avec cette id !! ",
      });
    }
    // Test if current client is the the offre's client
    if (offre.ClientID == req.user.id) {
      // Change status of offre to be already read
      offre.étéLu = true;
      //save the last changes
      offre.save();
      return res.status(200).json({
        status: "succès",
        offre,
      });
    }
    return res.status(400).send({
      message: "Vous n’avez pas la permission d’effectuer cette action !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      err,
    });
  }
};

// Update one offre by current employee
exports.updateOneOffre = async (req, res, next) => {
  try {
    // Test if there is an offre
    const offre = await Offre.findById(req.params.idOffre);
    if (!offre) {
      return res.status(400).send({
        message: "Aucune offre avec cette id !! ",
      });
    }
    // Test if current employee is the the owner of offre
    if (offre.LivreurID == req.user.id) {
      // Update changes in offre
      let doc = await Offre.findByIdAndUpdate(req.params.idOffre, req.body, {
        new: true,
        runValidators: true,
      });
      return res.status(200).json({
        status: "succès",
        data: {
          doc,
        },
      });
    }
    return res.status(404).json({
      status: "vous n'êtes pas responsable de cette offre !!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

// get one offre by admin
exports.findOneOffreAdmin = async (req, res) => {
  try {
    // Test if there is an offre
    const offre = await Offre.findById(req.params.idOffre)
      .populate("LivreurID")
      .populate("CommandeID")
      .populate("ClientID");
    if (offre) {
      return res.status(200).json({
        status: "succès",
        offre,
      });
    }
    return res.status(400).send({
      message: "Aucune offre avec cette id !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      err,
    });
  }
};

// get all offres of an specific commande by admin
exports.findOffresCommandeForAdmin = async (req, res) => {
  try {
    // Test if there is a commande
    const commande = await Commande.findById(req.params.idCommande).populate(
      "offres"
    );
    let offres = commande.offres;
    // Test if commande's offres s an empty array
    if (offres.length == 0) {
      return res.status(400).send({ message: "Il n'y a pas d'offres !! " });
    }
    return res.status(200).json({
      status: "succès",
      offres,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      err,
    });
  }
};
