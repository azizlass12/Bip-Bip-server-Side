const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv");
require("dotenv").config;

//get token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// create and send token => to USE
const createSendToken = (user, statusCode, res) => {
  // 3ayetelha
  const token = signToken(user._id);
  // Remove password from output pour la secrete
  user.MotDePasse = undefined;
  res.status(statusCode).json({
    status: "succès",
    token,
    data: {
      user,
    },
  });
};

//login
exports.login = async (req, res, next) => {
  try {
    //1)check if email and password exist in req.body
    const { Email, MotDePasse } = req.body;
    if (!Email || !MotDePasse) {
      return res.status(404).json({
        status: "échouer",
        message: "Veuillez fournir un Email et un mot de passe.",
      });
    }
    //2) check if useremail exists && password is correct password exist
    const user = await User.findOne({ Email }).select("+MotDePasse");
    if (!user || !(await user.validatePassword(MotDePasse, user.MotDePasse))) {
      return res.status(401).json({
        status: "échouer",
        message: "Email ou mot de passe erronés ",
      });
    }
    //3) if evrything ok , send token to the client
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(404).json({
      status: "échouer",
      message: err,
    });
  }
};

//signup
exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      Nom: req.body.Nom,
      Prenom: req.body.Prenom,
      Email: req.body.Email,
      MotDePasse: req.body.MotDePasse,
      ConfirmerMotDePasse: req.body.ConfirmerMotDePasse,
      NumeroTlf: req.body.NumeroTlf,
      Gouvernorat: req.body.Gouvernorat,
      Ville: req.body.Ville,
      role: req.body.role,
      Adresse: req.body.Adresse,
    });
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(404).json({
      status: "échouer",
      message: err,
    });
  }
};

//protect routes => authorize just the logged  user
exports.protect = async (req, res, next) => {
  // 1)GETTING TOKEN AND CHECK OF IT'S THERE
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({
      status: "échouer",
      message:
        "vous êtes connecté ! veuillez vous connecter pour y accéder !! ",
    });
  }
  // 2) VERIFICATION TOKEN
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // 3) IF THE USER STILL EXIST
  const currentUser = await User.findById(decoded.id);
  //decoded.id is the id of the user logged in
  if (!currentUser) {
    return res.status(401).send({
      status: "échouer",
      message: "l’utilisateur appartenant à ce token n’existe plus !! ",
    });
  }
  // Grand access to protected route
  req.user = currentUser;
  next();
};

//restrict to admin , client , employee
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        status: "échouer",
        message: "Vous n’avez pas la permission d’effectuer cette action !! ",
      });
    }
    next();
  };
};
