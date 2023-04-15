//const multer = require("multer");
/*
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("imageUrl");
*/
const multer = require("multer");

//extension des fichiers images
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};

//configuration de multer
const storage = multer.diskStorage({
  //indication où enregistrer les fichiers entrants
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  //indication d'utiliser des parametres: nom d'origine espace vs underscore
  //ajout de timestamp comme nom de fichier

  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

//export du middleware multer
module.exports = multer({ storage: storage }).single("imageUrl");

