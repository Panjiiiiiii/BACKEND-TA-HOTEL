const multer = require("multer");
const path = require(`path`);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/user");
  },

  filename: (req, file, cb) => {
    cb(null, "img-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const acceptedType = [`image/jpg`, `image/jpeg`, `image/png`];

    if (!acceptedType.includes(file.mimetype)) {
      cb(null, false);
      return cb(`invalid file type (${file.mimetype})`);
    }

    const fileSize = req.headers[`content-length`];
    const maxSize = 1 * 1024 * 1024;
    if (fileSize > maxSize) {
      cb(null, false);
      return cb(`file size is too large`);
    }

    cb(null, true);
  },
});
module.exports = upload;
