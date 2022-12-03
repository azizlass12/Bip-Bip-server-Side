const factory = require("./factory");
const User = require("../models/userModel");

// find all users
exports.getAllUsers = factory.findAll(User);

// find one client for admin
exports.getUserById = factory.findOne(User);

// update user
exports.updateUser = factory.updateProfile(User);

// Retrieve sendCommandes by cuurent employee
exports.findSendCommandes = factory.getAllSendCommands(User);

// delete user
exports.deleteUser = factory.deleteOneUser(User);

//get current user using the getUserByID
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// find all clients for admin
exports.findAllClients = async (req, res, next) => {
  try {
    // Test if there is clients
    const doc = await User.find({ role: "client" }).populate("MesCommandes");
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

// find all admins for admin
exports.findAllAdmins = async (req, res, next) => {
  try {
    // Test if there is admins
    const doc = await User.find({ role: "admin" });
    return res.status(200).json({
      status: "succès",
      result: doc.length,
      data: {
        data: doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

// find all employees for admin
exports.findAllEmployees = async (req, res, next) => {
  try {
    // Test if there is employees
    const doc = await User.find({ role: "livreur" })
      .populate("DemmandesEnvoyees")
      .populate("CommandesIncomplets")
      .populate("CommandesComplets");
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

// Liste of employees who have 5 rate less than 2
exports.findAllFakeEmployees = async (req, res, next) => {
  try {
    // Test if there is a fake employees
    const fakeEmpl = await User.find({ NombreNegativeEval: { $gte: 5 } })
      .populate("DemmandesEnvoyees")
      .populate("CommandesIncomplets")
      .populate("CommandesComplets");
    if (fakeEmpl) {
      return res.status(200).json({
        status: "succès",
        result: fakeEmpl.length,
        data: {
          fakeEmpl,
        },
      });
    }
    return res.status(404).json({
      status: "Il n'y a pas de faux livreur",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

exports.getEmpById = async (req, res, next) => {
  try {
    // Test if there is an employee
    const user = await User.findById(req.params.id);
    if (user) {
      return res.status(200).json({
        status: "succès",
        data: {
          user,
        },
      });
    }
    return res.status(404).json({
      status: "Aucune livreur avec cette id !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};
