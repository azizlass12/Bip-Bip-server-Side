const User = require("../models/userModel");
const Offre = require("../models/offreModel");

exports.createOne = (Model) => async (req, res, next) => {
  try {
    // Creat new commande
    const commande = await Model.create(req.body);
    // Test if commande was created
    if (commande) {
      // Push the id of current client in commande
      await Model.findByIdAndUpdate(commande.id, {
        $push: { utilisateurID: req.user.id },
      });
      //Add the id of commande commande in the profile current client
      await User.findByIdAndUpdate(req.user.id, {
        $push: { MesCommandes: commande.id },
      });
      return res.status(201).json({
        status: "succès",
        data: {
          commande,
        },
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.findAll = (Model) => async (req, res, next) => {
  try {
    // Test if there is a document
    const doc = await Model.find({});
    return res.status(200).json({
      status: "succès",
      result: doc.length,
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.findOne = (Model) => async (req, res, next) => {
  try {
    // Test if there is a document
    let doc = await Model.findById(req.params.id);
    if (!doc) {
      return "Aucun document avec cette id !! ";
    }
    return res.status(200).json({
      status: "succès",
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.findOneCmmndAdmin = (Model) => async (req, res, next) => {
  try {
    // Test if there is a commande
    let doc = await Model.findById(req.params.id).populate("utilisateurID");
    if (!doc) {
      return "Aucun document avec cette id !! ";
    }
    return res.status(200).json({
      status: "succès",
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.updateProfile = (Model) => async (req, res, next) => {
  try {
    if (req.user.id == req.params.id) {
      // Update new changes
      let doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      // Test if document was update successfuly
      if (doc) {
        return res.status(200).json({
          status: "succès",
          data: {
            doc,
          },
        });
      }
      return res.status(404).json({
        status: "Aucun document avec cette id !!",
      });
    }
    return res.status(404).json({
      status: "Vous n’avez pas la permission d’effectuer cette action !!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

//get all commandes that current employee was accepted on it
exports.getAllMissions = (Model) => async (req, res) => {
  try {
    // Test if there is // Test if there commandes
    const commande = await Model.find({ LivreurResponsable: req.user.id });
    if (!commande) {
      return res
        .status(400)
        .send({ message: "vous n’avez aucune aucune commande !! " });
    }
    return res.status(200).json({
      status: "succès",
      commande,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      err,
    });
  }
};

exports.deleteOneUser = (Model) => async (req, res, next) => {
  try {
    // Find user and delete it
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc)
      return res.status(400).json({
        status: "Aucun utilisateur avec cette id !!",
      });
    return res.status(200).json({
      status: "succès",
      data: null,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.updateOneCommande = (Model) => async (req, res, next) => {
  try {
    // Test if there is a commande
    const commande = await Model.findById(req.params.idCommande);
    if (!commande) {
      return res.status(400).send({
        message: "Aucune commande avec cette id !! ",
      });
    }
    // Test if current user was the owner of commande
    if (commande.utilisateurID == req.user.id) {
      // Update new changes
      let doc = await Model.findByIdAndUpdate(req.params.idCommande, req.body, {
        new: true,
        runValidators: true,
      }).populate("utilisateurID");
      return res.status(200).json({
        status: "succès",
        data: {
          doc,
        },
      });
    }
    return res.status(404).json({
      status: "Vous n’êtes pas responsable de cette commande",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.deleteOneCommande = (Model) => async (req, res, next) => {
  try {
    // Test if there is a commande
    const commande = await Model.findById(req.params.idCommande);
    if (!commande) {
      return res.status(400).send({
        message: "Aucune commande avec cette id !! ",
      });
    }
    currentUser = req.user;
    if (commande.utilisateurID == currentUser.id) {
      if (commande.Statut == "reservé") {
        if (commande.cacher == false) {
          commande.cacher = true;
          //save the last changes
          commande.save();
          return res.status(200).json({
            status: "succès",
            data: null,
          });
        }
        return res.status(400).send({
          message: "Cette commande déja supprimée !!  ",
        });
      }
      const lengList = commande.ListeDemmandeLivreurs.length;
      for (i = 0; i < lengList; i++) {
        // Test if the employee selected is exist
        const EmployeeSelected = await User.findById(
          commande.ListeDemmandeLivreurs[i]
        );
        //Filter the id of commande from the liste of request send
        EmployeeSelected.DemmandesEnvoyees =
          EmployeeSelected.DemmandesEnvoyees.filter(
            (e) => e._id != req.params.idCommande
          );
        // Update all the last changes on the employee profile
        let empl = await User.findByIdAndUpdate(
          EmployeeSelected.id,
          EmployeeSelected,
          {
            new: true,
            runValidators: true,
          }
        );
      }
      const lengListOffres = commande.offres.length;
      for (i = 0; i < lengListOffres; i++) {
        // Find offre and delete it
        const Offres = await Offre.findByIdAndDelete(commande.offres[i]);
      }
      //Filter the id of commande from the liste of commandes for current client
      currentUser.MesCommandes = currentUser.MesCommandes.filter(
        (e) => e._id != req.params.idCommande
      );
      // Update all the last changes on the current client
      let user = await User.findByIdAndUpdate(currentUser.id, currentUser, {
        new: true,
        runValidators: true,
      });
      // Find commande and delete it
      const doc = await Model.findByIdAndDelete(req.params.idCommande);
      if (doc) {
        return res.status(200).json({
          status: "succès",
          data: null,
        });
      }
      return res.status(404).json({
        status: "Vous n’êtes pas responsable de cette commande",
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

//get request send to commandes by current employee
exports.getAllSendCommands = (Model) => async (req, res) => {
  try {
    // find the profile of current user
    const user = await User.findById(req.user.id).populate("DemmandesEnvoyees");
    let commandes = user.DemmandesEnvoyees;
    // Test if liste of send request is an empty liste
    if (!commandes.length) {
      return res
        .status(400)
        .send({ message: "vous n’avez aucune demande envoyée !! " });
    }
    return res.status(200).json({
      status: "succès",
      commandes,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      err,
    });
  }
};

exports.getAllOpenCommandes = (Model) => async (req, res, next) => {
  try {
    // Test if there is commandes
    const doc = await Model.find({ Statut: "ouvert" })
      .populate("utilisateurID")
      .populate("ListeDemmandeLivreurs");
    return res.status(200).json({
      status: "succès",
      result: doc.length,
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.getAllCloseCommandes = (Model) => async (req, res, next) => {
  try {
    // Test if there is commandes
    const doc = await Model.find({ Statut: "reservé" })
      .populate("utilisateurID")
      .populate("ListeDemmandeLivreurs")
      .populate("LivreurResponsable");
    return res.status(200).json({
      status: "succès",
      result: doc.length,
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.getAllReachedCommandes = (Model) => async (req, res, next) => {
  try {
    // Test if there is commandes
    const doc = await Model.find({ LivreOuNon: true })
      .populate("utilisateurID")
      .populate("ListeDemmandeLivreurs")
      .populate("LivreurResponsable");
    return res.status(200).json({
      status: "succès",
      result: doc.length,
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.getAllUnreachedCommandes = (Model) => async (req, res, next) => {
  try {
    // Test if there is commandes
    const doc = await Model.find({ LivreOuNon: false })
      .populate("utilisateurID")
      .populate("ListeDemmandeLivreurs")
      .populate("LivreurResponsable");
    return res.status(200).json({
      status: "succès",
      result: doc.length,
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};
