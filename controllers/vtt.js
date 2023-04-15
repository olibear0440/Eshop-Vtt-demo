const VttModel = require("../models/Vtt.js");
const mongoDB = require("../mongoDB.js");
const fs = require("fs");

/******************routage des Vtts*************** */

/* Creer un model vtt*/
exports.createVtt = (req, res, next) => {
  const vtt = new VttModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    averageRating: req.body.averageRating,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  vtt
    .save()
    .then(() =>
      res.status(201).json({ message: "Le produit à été enregistré !" })
    )
    .catch((error) => res.status(400).json({ error: error }));
};

//recuperer tout les produits
exports.getAllVtts = (req, res, next) => {
  VttModel.find()
    .then((vtt) => res.status(200).json(vtt))
    .catch((error) => res.status(400).json({ error: error }));
};

//recuperer un produit
exports.getOneVtt = (req, res, next) => {
  VttModel.findOne({ _id: req.params.id })
    .then((vtt) => res.status(200).json(vtt))
    .catch((error) => res.status(400).json({ error: error }));
};

exports.modifyVtt = (req, res, next) => {
  const _id = { _id: req.params.id };
  const { name, description, averageRating, price } = req.body;
  //requette complete de l'image dans la bdd ${http}${localhost + port}/dossier du fichier/ ${nom du fichier}
  const imageUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;

  VttModel.findByIdAndUpdate(
    _id,
    { name, price, description, averageRating, imageUrl },
    { new: true }
  )
    .then(() => res.status(201).json({ message: "le produit à été modifié !" }))
    .catch((error) => res.status(404).json(error));
};

exports.deleteVtt = (req, res, next) => {
  const _id = req.params.id;
  VttModel.findById(_id)
    .then((vtt) => {
      if (!vtt) {
        return res.status(404).json({ message: "Produit inexistant" });
      } else {
        //recuperer le chemin d'acces de l'image juste son nom et l'extension
        const filename = vtt.imageUrl.split("/images/")[1];
        //methode unlink pour effacer le fichier de maniere dynamique
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Erreur interne du serveur" });
          } else {
            VttModel.deleteOne({ _id })
              .then(() =>
                res.status(200).json({ message: "Le produit a été supprimé !" })
              )
              .catch((err) =>
                res.status(500).json({ message: "Erreur interne du serveur" })
              );
          }
        });
      }
    })
    .catch((err) =>
      res.status(500).json({ message: "Erreur interne du serveur" })
    );
};
