const multer = require('multer')
const util = require("util")

// create images directory if not existed
var fs = require('fs');
var dir = './images';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './images')
      },
      filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype]
        const name = file.originalname.split('.' + extension).join('_')
        callback(null, name + Date.now() + '.' + extension)
      }
})

const uploadFile = multer({
  storage: storage
}).single('image')

const uploadFileMiddleware = util.promisify(uploadFile)

module.exports = uploadFileMiddleware