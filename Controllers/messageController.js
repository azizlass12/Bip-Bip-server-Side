const Message = require("../models/messageModel");
const User = require("../models/userModel");

// Send a message to admin by current client
exports.sendMessage = async (req, res, next) => {
  try {
    const message = await Message.create(req.body);
    if (message) {
      // Push the id of current employee in message
      await Message.findByIdAndUpdate(message.id, {
        $push: { UtilisateurID: req.user.id },
      });
      return res.status(201).json({
        status: "succès",
        data: {
          message,
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

// Get all messages for admin
exports.getAllMessages = async (req, res, next) => {
  try {
    // Test if there is messages
    const doc = await Message.find().populate("UtilisateurID");
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

// Get all unread messages for admin
exports.getAllUnreadMessage = async (req, res, next) => {
  try {
    // Test if there is messages
    const doc = await Message.find({ étéLu: false }).populate("UtilisateurID");
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

// Get one message for admin
exports.getOneMessage = async (req, res, next) => {
  try {
    // Test if there is an message
    let message = await Message.findById(req.params.idMessage).populate(
      "UtilisateurID"
    );
    if (!message) {
      return res.status(400).send({
        message: "Aucune message avec cette id !! ",
      });
    }
    // Change status of message
    message.étéLu = true;
    //save the last changes
    message.save();
    return res.status(200).json({
      status: "succès",
      data: {
        message,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};

// Delete one message for admin
exports.deleteOneMessageAdmin = async (req, res, next) => {
  try {
    // Find message and delete it
    const doc = await Message.findByIdAndDelete(req.params.idMessage);
    if (!doc) {
      return res.status(400).json({
        status: "Aucune message avec cette id !!",
      });
    }
    return res.status(200).json({
      status: "le message a été supprimé !! ",
      data: null,
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};
