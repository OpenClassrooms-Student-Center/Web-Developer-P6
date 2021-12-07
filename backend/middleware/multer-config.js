const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const fileName = file.originalname.split(" ").join("_").substring(0, file.originalname.lastIndexOf("."));
    const extension = MIME_TYPES[file.mimetype];
    callback(null, fileName + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
