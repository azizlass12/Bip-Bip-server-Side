const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const SALT_WORK_FACTOR = 10;

//Schema of Review an employee
const reviewSchema = mongoose.Schema({
  Nom: { type: String, required: true, select: true },
  Evaluation: {
    type: Number,
    required: [true, "Merci d'évaluer cette livreur !! "],
    select: true,
  },
  Commentaire: { type: String, select: true },
  ClientID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    select: true,
  },
  LivreurID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    select: true,
  },
  DateCreation: {
    type: Date,
    default: Date.now(),
    select: true,
  },
});

//Schema of User
const userSchema = new mongoose.Schema({
  Nom: {
    type: String,
    required: [true, "Merci d'entrer votre nom ! "],
  },
  Prenom: {
    type: String,
    required: [true, "Merci d'entrer votre prénom ! "],
  },
  Email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, "Merci d'entrer votre email"],
    validate: [validator.isEmail, "Merci d'entrer une email valide !! "],
  },
  MotDePasse: {
    type: String,
    required: [true, "Merci d'entrer votre mot de passe !! "],
    minlength: 8,
    select: false,
  },
  ConfirmerMotDePasse: {
    type: String,
    required: [true, "Merci de confirmer votre mot de passe !! "],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.MotDePasse;
      },
      message: "Les mots de passe ne sont pas les memes !",
    },
  },
  NumeroTlf: {
    type: Number,
    required: [true, "Merci d'entrer votre numéro tlf !! "],
    minlength: 8,
  },
  Adresse: {
    type: String,
    required: [true, "Merci d'entrer votre adresse !! "],
    minlength: 2,
  },
  Gouvernorat: {
    type: String,
    required: [true, "Merci d'entrer votre Gouvernorat !! "],
    minlength: 2,
  },
  Ville: {
    type: String,
    required: [true, "Merci d'entrer votre Ville !! "],
    minlength: 2,
  },
  role: {
    type: String,
    default: "client",
    enum: ["admin", "livreur", "client"],
  },

  //  commandes maked by user
  MesCommandes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Commande",
    },
  ],
  // demandes of commandes for employees
  DemmandesEnvoyees: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Commande",
    },
  ],
  // the unfinished commande of employee
  CommandesIncomplets: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Commande",
    },
  ],
  //add commandes
  CommandesComplets: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Commande",
    },
  ],
  OffreEnvoyees: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Offre",
    },
  ],
  evalue: [reviewSchema],
  Evaluation: {
    type: Number,
    required: true,
    default: 0,
  },
  numEvaluation: {
    type: Number,
    required: true,
    default: 0,
  },
  tableauEval: [],
  NombreNegativeEval: {
    type: Number,
    default: 0,
  },
  DateCreation: {
    type: Date,
    default: Date.now(),
  },
  NombreSuccesCommande: {
    type: Number,
    default: 0,
  },
});

//2) validate password
userSchema.methods.validatePassword = async function (
  condidatePassword,
  userPassword
) {
  return await bcrypt.compare(condidatePassword, userPassword);
};

const Utilisateur = mongoose.model("Utilisateur", userSchema);
module.exports = Utilisateur;
