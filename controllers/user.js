const UserModel = require("../models/User.js");
const bcrypt = require("bcrypt");
const mongoDB = require("../mongoDB.js");
const passwordSchema = require("../passwordValidation-config.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
/******************routage des users*************** */

/*creer un utilisateur
 * Condition de validation pour le mot de passe
 * crypter le mot de passe dans la base de donnée
 * creer l'utilisateur à partir du UserModel et la methode save de mongoose
 */

exports.createUser = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    return res.status(400).json({
      error:
        "Mot de passe non valide :" +
        passwordSchema.validate("req.body.password", { list: true }),
    });
  } else {
    bcrypt.hash(req.body.password, 10).then((hash) => {
      const user = new UserModel({
        nom: req.body.nom,
        prenom: req.body.prenom,
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error: error }));
    });
  }
};

/* confirmer un utilisateur existant dans la bdd

 * Verifier que l'email (unique) existe dans la bdd => methode findOne() mongoose
 * comparer le password avec le password existant dans la bdd
 * creer un token unique et parametré à la session de l'utilisateur
 * stocker les données de config du token (dotenv)
 */
exports.loginUser = (req, res, next) => {
  UserModel.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/*recuperer tous les utilisateurs*/
exports.getAllUsers = (req, res, next) => {
  UserModel.find()
    .then((UserModel) => res.status(200).json(UserModel))
    .catch((error) => res.status(400).json(error));
};
/*recuperer 1 utilisateur par son id*/
exports.getOneUser = (req, res, next) => {
  const userId = { _id: req.params.id };
  UserModel.findOne(userId)
    .then((UserModel) => res.status(200).json(UserModel))
    .catch((error) => res.status(400).json(error));
};

/*modifier un utilisateur*/
exports.modifyUser = (req, res, next) => {
  UserModel.updateOne(
    { _id: req.params.id },
    { ...req.body, _id: req.params.id }
  )
    .then(() =>
      res.status(201).json({ message: "l'utilisateur' à été modifié !" })
    )
    .catch((error) => res.status(404).json(error));
};
/*effacer un utilisateur*/
exports.deleteUser = (req, res) => {
  UserModel.deleteOne({ _id: req.params.id })
    .then(() =>
      res.status(200).json({ message: "L'utilisateur à été supprimé !" })
    )
    .catch((error) => res.status(404).json({ error: error }));
};
