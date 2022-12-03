const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({path:"./config.env"});
const app = require("./app");

//CONNECT DATABASE
const DB = process.env.DATABASE;
mongoose.connect(DB).then(() => {
  console.log("BD Connexion avec succès ");
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`serveur fonctionnant sur le port ${port}`);
});
