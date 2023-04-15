const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

/********mise en place server de l'api******************* */
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  next();
});

/******************import module de routage************* */
const userRoute = require("./routes/user");
const vttRoute = require("./routes/vtt");
const cartRoute = require("./routes/cart");

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/********mise en place routage******************* */
app.use("/users", userRoute);
app.use("/vtts", vttRoute);
app.use("/cart", cartRoute);

//middleware dossier images
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
