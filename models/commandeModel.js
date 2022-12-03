const mongoose = require("mongoose");

//Schema of a commande
const commandeSchema = new mongoose.Schema({
  NomDestinataire: {
    type: String,
    required: [true, "Merci d'entrer le nom de destinataire !! "],
    select: true,
  },
  PrenomDestinataire: {
    type: String,
    required: [true, "Merci d'entrer le prénom de destinataire !! "],
    select: true,
  },
  NumeroTlfDestinataire: {
    type: Number,
    required: [true, "Merci d'entrer le numéro tlf de destinataire !! "],
    select: true,
    minlength: 8,
  },
  AdressDestinataire: {
    type: String,
    required: [true, "Merci d'entrer l'adress de destinataire !!  "],
    select: true,
    minlength: 2,
  },
  GouvernoratDestinataire: {
    type: String,
    required: [true, "Merci d'entrer le gouvernorat de destinataire !! "],
    select: true,
    minlength: 2,
  },
  VilleDestinataire: {
    type: String,
    required: [true, "Merci d'entrer le ville de destinataire !! "],
    select: true,
    minlength: 2,
  },
  Largeur: {
    type: Number,
  },
  Longueur: {
    type: Number,
    select: true,
  },
  Hauteur: {
    type: Number,
    select: true,
  },
  Poids: {
    type: Number,
    select: true,
  },
  Description: {
    type: String,
    required: [true, "Merci d'entrer la description de votre commande !! "],
    select: true,
    minlength: 2,
  },
  NbreDePiece: {
    type: Number,
    required: [true, "Merci d'entrer le nombre de piece de commande !!  "],
    select: true,
    default: 1,
  },
  utilisateurID: {
    type: mongoose.Schema.ObjectId,
    ref: "Utilisateur",
  },
  ListeDemmandeLivreurs: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Utilisateur",
    },
  ],
  LivreurResponsable: {
    type: mongoose.Schema.ObjectId,
    ref: "Utilisateur",
    select: true,
  },

  Statut: {
    type: String,
    enum: ["ouvert", "reservé"],
    default: "ouvert",
  },
  LivreOuNon: {
    type: Boolean,
    default: false,
    select: true,
  },
  offres: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Offre",
    },
  ],
  ResponsabLivreurEval: {
    type: Boolean,
    default: false,
    select: true,
  },
  DateCreation: {
    type: Date,
    default: Date.now(),
  },
  cacher: {
    type: Boolean,
    default: false,
    select: true,
  },
  OffreAcceptée: {
    type: Boolean,
    default: false,
    select: true,
  },
  MissionLu: {
    type: Boolean,
    default: false,
    select: true,
  },
});

//MODEL SCHEMA
const Commande = mongoose.model("Commande", commandeSchema);
module.exports = Commande;
