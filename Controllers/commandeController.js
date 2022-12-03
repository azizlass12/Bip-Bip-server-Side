const Commande = require("../models/commandeModel");
const factory = require("./factory");
const User = require("../models/userModel");
const Offre = require("../models/offreModel");

// Get all missions by cuurent employee
exports.findMessionEmployee = factory.getAllMissions(Commande);

// Create and Save a new Commande
exports.createCommande = factory.createOne(Commande);

// Delete an commande with a specified Id in the request for current client
exports.deleteCommande = factory.deleteOneCommande(Commande);

// Update an commande identified by the Id in the request for current client
exports.updateCommande = factory.updateOneCommande(Commande);

// Find all commandes for admin
exports.getAllCommandes = factory.findAll(Commande);

// Find all open commandes for admin
exports.findAllOpenCommandes = factory.getAllOpenCommandes(Commande);

// Find all close commandes for admin
exports.findAllCloseCommandes = factory.getAllCloseCommandes(Commande);

// Find all reached commandes for admin
exports.findAllReachedCommandes = factory.getAllReachedCommandes(Commande);

// Find all unreached commandes for admin
exports.findAllUnreachedCommandes = factory.getAllUnreachedCommandes(Commande);

// Find an commande with an Id for employee
exports.getOneCommandeForEmp = factory.findOne(Commande);

// Find an commande with an Id for admin
exports.getOneCommandeForAdmn = factory.findOneCmmndAdmin(Commande);

// Send a request to a specific commande by current employee
exports.sendRequestAndOffreToCommande = async (req, res) => {
  try {
    currentUser = req.user;
    // Test if there is a commande
    let commande = await Commande.findById(req.params.idCommande);
    if (!commande) {
      return res.status(400).send({
        message: "Aucune commande avec cette id !! ",
      });
    }
    // Test if the commande was open
    if (commande.Statut == "ouvert") {
      // Test if the current employee send a request
      if (commande.ListeDemmandeLivreurs.includes(currentUser.id)) {
        return res.status(400).send({
          message: "vous envoyez déjà une demande à cette commande !! ",
        });
      }
      // Create an offre
      const offre = await Offre.create(req.body);
      // Push information of Employee , Commande , Client on the offre
      await Offre.findByIdAndUpdate(offre.id, {
        $push: {
          LivreurID: req.user.id,
          CommandeID: req.params.idCommande,
          ClientID: commande.utilisateurID,
        },
      });
      //Add th id of offre in the specific commande
      await Commande.findByIdAndUpdate(req.params.idCommande, {
        $push: { offres: offre.id, ListeDemmandeLivreurs: currentUser.id },
      });
      //Add the id of offre and the id of commande in the profile current employee
      await User.findByIdAndUpdate(currentUser.id, {
        $push: {
          DemmandesEnvoyees: req.params.idCommande,
          OffreEnvoyees: offre.id,
        },
      }).populate("OffreEnvoyees");
      return res.status(200).json({
        status: "succès",
        data: {
          currentUser,
        },
      });
    }
    return res.status(404).json({
      status: "cette commande reservé !! ",
      err,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      message: err,
    });
  }
};

// Cancel request and delete offre for a cuurent employee
exports.cancelRequestDeleteOffre = async (req, res) => {
  try {
    let userToEdit = req.user;
    // Test if there is a commande
    let commande = await Commande.findById(req.params.idCommande);
    if (!commande) {
      return res.status(400).send({
        message: "Aucune commande avec cette id !! ",
      });
    }
    // Test if there is an offre
    let offre = await Offre.findById(req.params.idOffre);
    if (!offre) {
      return res.status(400).send({
        message: "Aucune Offre avec cette id !! ",
      });
    }
    // Test if the current employee send a request
    if (commande.ListeDemmandeLivreurs.includes(req.user.id)) {
      // Test if the current employee is the responsible to th specific commande
      // the responsible employee can't cancel his request
      if (
        commande.Statut == "ouvert" ||
        (commande.Statut == "reservé" &&
          commande.LivreurResponsable != req.user.id)
      ) {
        //Filter the id of the current employee from the liste of request in a specifique commande
        commande.ListeDemmandeLivreurs = commande.ListeDemmandeLivreurs.filter(
          (e) => e._id != userToEdit.id
        );
        //Filter the id of an offre from the liste of offres in a specifique commande
        commande.offres = commande.offres.filter(
          (e) => e._id != req.params.idOffre
        );
        // Update all the last changes on commande
        let doc = await Commande.findByIdAndUpdate(commande.id, commande, {
          new: true,
          runValidators: true,
        });
        //Filter the id of a specifique commande from the liste of commandes that the current employee send request to them
        userToEdit.DemmandesEnvoyees = userToEdit.DemmandesEnvoyees.filter(
          (e) => e._id != req.params.idCommande
        );
        //Filter the id of a specifique offre from the liste of offres that the current employee send it to a specific commande
        userToEdit.OffreEnvoyees = userToEdit.OffreEnvoyees.filter(
          (e) => e._id != req.params.idOffre
        );
        // Update all the last changes on the current employee
        let user = await User.findByIdAndUpdate(userToEdit.id, userToEdit, {
          new: true,
          runValidators: true,
        });
        //delete the specific offre
        const offre = await Offre.findByIdAndDelete(req.params.idOffre);
        if (user) {
          return res.status(200).json({
            status: "votre demande a été annulée",
            data: {
              user,
            },
          });
        }
      }
      return res.status(400).send({
        message:
          "Vous êtes le responsable de cette commande, Vous ne pouver pas supprimer le demmande !! ",
      });
    }
    return res.status(400).send({
      message: "Vous n’envoyez pas de demande à cette commande !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      message: err,
    });
  }
};

// Perform an employee to a commande by cuurent client andchange the  commande's status
exports.PerformEmployeeToCommande = async (req, res) => {
  try {
    // Test if there is a commande
    let commande = await Commande.findById(req.params.idCommande);
    if (!commande) {
      return res.status(400).send({
        message: "Aucune commande avec cette id !!",
      });
    }
    // Test if the current employee is the creater of the specific commande
    if (commande.utilisateurID == req.user.id) {
      // Test if the current client choose an employee to be the responsible to the commande
      if (!commande.LivreurResponsable) {
        // Test if the employee alearady send a request to the specific commande
        if (commande.ListeDemmandeLivreurs.includes(req.params.idEmp)) {
          //Make the specific employee a responsible to the specific commande
          commande.LivreurResponsable = req.params.idEmp;
          //Change the status of th commande
          commande.Statut = "reservé";
          (commande.OffreAcceptée = true),
            //Push id of commande into the liste of incomplet commande in profile of employee
            await User.findByIdAndUpdate(req.params.idEmp, {
              $push: { CommandesIncomplets: req.params.idCommande },
            }).populate("CommandesIncomplets");
          //save the last changes
          commande.save();
          return res.status(200).send({
            status: "succès",
            data: {
              commande,
            },
          });
        }
        return res.status(400).send({
          message: "Cet employé n’envoie aucune demande à votre commande !! ",
        });
      }
      return res.status(400).send({
        message: "Vous sélectionnez déjà un employé pour votre commande !! ",
      });
    }
    return res.status(400).send({
      message: "vous n’êtes pas responsable de cette commande !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      message: err,
    });
  }
};

// change the  commande's condition by an current employee
exports.changeCommandeCondition = async (req, res) => {
  try {
    currentUser = req.user;
    // Test if there is a commande
    let commande = await Commande.findById(req.params.idCommande);
    if (!commande) {
      return res.status(400).send({
        message: "Aucune commande avec cette id !!",
      });
    }
    // Test if the current employee is the responsible to the commande
    if (commande.LivreurResponsable != currentUser.id) {
      return res.status(400).send({
        message: "vous n’êtes pas responsable de cette commande !! ",
      });
    }
    // Test if the commande is already reached
    if (commande.LivreOuNon) {
      return res.status(400).send({
        message: "Cette commande est déjà atteinte",
      });
    }
    // change the  commande's condition to be an reached commande
    commande.LivreOuNon = true;
    //save the last changes
    commande.save();
    //Filter the id of the commande from the liste of the incomplet commande in profile of current employee
    currentUser.CommandesIncomplets = currentUser.CommandesIncomplets.filter(
      (e) => e._id != req.params.idCommande
    );
    // increment the number of the succes commande
    currentUser.NombreSuccesCommande = currentUser.NombreSuccesCommande + 1;
    // Update all the last changes on the current employee
    await User.findByIdAndUpdate(currentUser.id, currentUser, {
      new: true,
      runValidators: true,
    });
    //Add the id of commande in the profile current employee
    let doc = await User.findByIdAndUpdate(currentUser.id, {
      $push: { CommandesComplets: req.params.idCommande },
    });
    //Test if there is an update on doc
    if (doc) {
      return res.status(200).json({
        status: "Commande atteinte avec succès",
        data: {
          doc,
        },
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      message: err,
    });
  }
};

// Find all unreached commandes for current client
exports.findMyUnreachedCommandes = async (req, res) => {
  try {
    // Test if there is a commande
    const commandes = await Commande.find({
      cacher: false,
      LivreOuNon: false,
      utilisateurID: req.user.id,
    })
      .populate("utilisateurID")
      .populate("ListeDemmandeLivreurs")
      .populate("LivreurResponsable");
    if (!commandes) {
      return res
        .status(400)
        .send({ message: "vous n’avez pas des commandes en attents ! " });
    }
    return res.status(200).json({
      status: "succès",
      commandes,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      message: err,
    });
  }
};

// Find all reached commandes for current client
exports.findMyReachedCommandes = async (req, res) => {
  try {
    // Test if there is a commande
    const commandes = await Commande.find({
      cacher: false,
      LivreOuNon: true,
      utilisateurID: req.user.id,
    })
      .populate("utilisateurID")
      .populate("ListeDemmandeLivreurs");
    if (!commandes) {
      return res
        .status(400)
        .send({ message: "vous n’avez pas des commandes livrées ! " });
    }
    return res.status(200).json({
      status: "succès",
      commandes,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      message: err,
    });
  }
};
// delete one commande for admin
exports.deleteCommandeAdmin = async (req, res, next) => {
  try {
    // Test if there is a commande
    const commande = await Commande.findById(req.params.idCommande);
    if (!commande) {
      return res.status(400).send({
        message: "Aucune commande avec cette id !!",
      });
    }
    // Test if the commande already have an employee responsible or it's already reached
    if (commande.Statut == "reservé" || commande.LivreOuNon == true) {
      return res.status(400).send({
        message: "Vous n’avez pas la permission d’effectuer cette action !! ",
      });
    }

    const lengList = commande.ListeDemmandeLivreurs.length;
    // enter into the list of employee request
    for (i = 0; i < lengList; i++) {
      // select employee
      const EmployeeSelected = await User.findById(
        commande.ListeDemmandeLivreurs[i]
      );
      EmployeeSelected.DemmandesEnvoyees =
        //Filter the id of commande from the liste of request send
        EmployeeSelected.DemmandesEnvoyees.filter(
          (e) => e._id != req.params.idCommande
        );
      // Update all the last changes on the employee
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
      const Offres = await Offre.findByIdAndDelete(commande.offres[i]);
    }
    ClientResponsable = await User.findById({ _id: commande.utilisateurID });
    //Filter the id of commandean from the liste of commandes of  an client
    ClientResponsable.MesCommandes = ClientResponsable.MesCommandes.filter(
      (e) => e._id != req.params.idCommande
    );
    // Update all the last changes on the employee profile
    let user = await User.findByIdAndUpdate(
      ClientResponsable.id,
      ClientResponsable,
      {
        new: true,
        runValidators: true,
      }
    );
    const doc = await Commande.findByIdAndDelete(req.params.idCommande);
    if (doc) {
      return res.status(200).json({
        status: "succès",
        data: null,
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

//get commandes by current client
exports.getCommandesClient = async (req, res) => {
  try {
    // Test if there is a commande
    const commandes = await Commande.find({
      utilisateurID: req.user.id,
      cacher: false,
    });
    if (!commandes) {
      return res
        .status(400)
        .send({ message: "vous n’avez aucune commande !! " });
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

//get one commande by cuurent user
exports.getOneCommandeClient = async (req, res) => {
  try {
    // Test if there is a commande
    const commande = await Commande.findById(req.params.idcommande);
    if (!commande) {
      return res.status(400).send({
        message: "Aucune commande avec cette id !! ",
      });
    }
    // Test if current client is the responsible of the commande
    if (commande.utilisateurID == req.user.id) {
      // Test if commande was already invisible from current client
      if (commande.cacher == true) {
        return res.status(400).send({
          message: "Vous avez récement supprimé cette commande !! ",
        });
      }
      return res.status(200).json({
        status: "succès",
        data: {
          commande,
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

// rating of an employee by current user
exports.createEmplReview = async (req, res) => {
  try {
    const { Evaluation, Commentaire } = req.body;
    // Test if there is an employee
    const employee = await User.findById(req.params.idEmp);
    if (!employee) {
      return res.status(400).send({
        message: "Aucun livreur avec cette id !!",
      });
    }
    // Test if there is a commande
    const commande = await Commande.findById(req.params.idCommande);
    if (!commande) {
      return res.status(400).send({
        message: "Aucune commande avec cette id !! ",
      });
    }
    // Test if commande's responsible id already review
    if (commande.ResponsabLivreurEval == true) {
      return res.status(400).send({
        message: "Employee déja raté ",
      });
    }
    // Test if the employee is the responsible of commande
    if (employee.id == commande.LivreurResponsable) {
      // Test if the commande is already reached
      if (commande.LivreOuNon == true) {
        // Creat review
        const evalution = {
          Nom: req.user.Nom,
          Evaluation: req.body.Evaluation,
          Commentaire: req.body.Commentaire,
          ClientID: req.user.id,
          LivreurID: employee.id,
        };
        // Test if employee has rate under 1
        if (evalution.Evaluation <= 1) {
          employee.NombreNegativeEval++;
        } else {
          employee.NombreNegativeEval = employee.NombreNegativeEval + 0;
        }
        // Push review into profile of employyee
        employee.evalue.push(evalution);
        // Convert rate to int
        employee.tableauEval.push(parseInt(Evaluation));
        employee.numEvaluation = employee.evalue.length;
        // Calculate new rate of employee
        const ev =
          employee.tableauEval.reduce((acc, item) => acc + item, 0) /
          employee.numEvaluation;
        // push new rate into profile of employee
        employee.Evaluation = ev;
        // Update all the last changes on the employee profile
        await User.findByIdAndUpdate(req.params.idEmp, employee, {
          new: true,
          runValidators: true,
        }).populate("evalue");
        // Change the status of employee's rate to be already review
        commande.ResponsabLivreurEval = true;
        //save the last changes
        await commande.save();
        return res.status(200).json({
          status: "evaluation ajouter",
          data: {
            employee,
          },
        });
      }
      return res.status(400).send({
        message:
          "tu ne peut pas raté maintenant parceque cette commande n'est terminé ",
      });
    }
    return res.status(400).send({
      message: "cette livreur n'est le responsable de cette commande",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      message: err,
    });
  }
};

// Get all commandes that current employee don't send request to it and open commandes
exports.findAllUnknownOpenCommandes = async (req, res, next) => {
  try {
    // Test if there is a commande
    const commande = await Commande.find({
      ListeDemmandeLivreurs: { $ne: req.user.id },
      Statut: "ouvert",
    });
    if (commande) {
      return res.status(200).json({
        status: "succès",
        result: commande.length,
        data: {
          commande,
        },
      });
    }
    return res.status(404).json({
      status: "Aucun commande ! ",
      data: err,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

// Get all commandes that current employee was accepted in it
exports.getAllNewMissions = async (req, res, next) => {
  try {
    // Test if there is new accepted commandes
    const Missions = await Commande.find({
      LivreurResponsable: req.user.id,
      OffreAcceptée: true,
      MissionLu: false,
    });
    if (Missions) {
      return res.status(200).json({
        status: "succés",
        resultat: Missions.length,
        data: {
          Missions,
        },
      });
    }
    return res.status(400).json({
      status: "Aucun Mission !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

// Get one commande that current employee was accepted in it
exports.getOneNewMission = async (req, res, next) => {
  try {
    // Test if there is commande
    const Mission = await Commande.findById(req.params.idCommande);
    if (Mission) {
      // Test if the current employee is the responsible of commande
      if (Mission.LivreurResponsable == req.user.id) {
        // Change status of mission
        Mission.MissionLu = true;
        // Save the last changes
        Mission.save();
        return res.status(200).json({
          status: "succés",
          data: {
            Mission,
          },
        });
      }
    }
    return res.status(400).json({
      status: "Aucun Mission !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};
