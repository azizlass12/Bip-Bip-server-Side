const mongoose = require("mongoose");

//Schema of a message
const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Merci d'entrer votre message !! "],
    minlength: 2,
  },
  UtilisateurID: {
    type: mongoose.Schema.ObjectId,
    ref: "Utilisateur",
  },
  étéLu: {
    type: Boolean,
    default: false,
    select: true,
  },
  DateCreation: {
    type: Date,
    default: Date.now(),
  },
});

//MODEL SCHEMA
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
