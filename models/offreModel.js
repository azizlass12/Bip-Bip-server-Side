const mongoose = require("mongoose");

// Schema of an offre
const offreSchema = new mongoose.Schema({
  DateRamassage: {
    type: Date,
    required: [true, "Merci d'entrer le date de ramassage de commande !! "],
    select: true,
  },
  HeureRamassage: {
    type: String,
    required: [true, "Merci d'entrer l'heure de ramassage de commande !! "],
    select: true,
  },
  DateArrive: {
    type: Date,
    required: [true, "Merci d'entrer le date d'arrive de commande !! "],
    select: true,
  },
  HeureArrive: {
    type: String,
    required: [true, "Merci d'entrer l'heure d'arrive de commande !! "],
    select: true,
  },
  montant: {
    type: String,
    required: [true, "Merci d'entrer votre montant"],
    select: true,
  },
  LivreurID: {
    type: mongoose.Schema.ObjectId,
    ref: "Utilisateur",
    select: true,
  },
  CommandeID: {
    type: mongoose.Schema.ObjectId,
    ref: "Commande",
    select: true,
  },
  ClientID: {
    type: mongoose.Schema.ObjectId,
    ref: "Utilisateur",
    select: true,
  },
  étéLu: {
    type: Boolean,
    default: false,
    select: true,
  },
  DateCreation: {
    type: Date,
    default: Date.now(),
    select: true,
  },
});

//MODEL SCHEMA
const Offre = mongoose.model("Offre", offreSchema);
module.exports = Offre;
