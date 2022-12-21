// Utilisation de multer pour enregistrer les images
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  // Enregistrement dans la dossier "images"
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // Création du nom de fichier unique avec Date.now()
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');