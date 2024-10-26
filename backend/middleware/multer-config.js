// This file allows for users to import files, in this case images

const multer = require('multer');

// accepted image formats
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// creates the ability to store the image associated with a sauce
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage: storage}).single('image');