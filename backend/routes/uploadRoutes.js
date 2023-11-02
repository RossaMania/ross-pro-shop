import path from "path";
import express from "express";

import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, "uploads/"); // The first argument is an error, so we pass null. The second is where we want the uploads to go--a folder called uploads.
  },
  filename (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp/; // The filetypes we want to allow.
  const mimetypes = /image\/jpg|image\/jpeg|image\/png|image\/webp/; // The mimetypes we want to allow.

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check the file extension name.
  const mimetype = mimetypes.test(file.mimetype); // Check the file mimetype (the type of file) to see if it matches the filetypes we want to allow.


  // If the file extension name and the file mimetype match the filetypes we want to allow, return true.
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Oops! Only image files!"), false); //If the file is not an image, return an error message.
  }
}

// The upload object is the multer object that we will use to upload the image.
const upload = multer({
  storage, fileFilter
});

const uploadSingleImage = upload.single("image"); // The upload.single() method is a middleware that will accept a single file with the name image.

router.post("/", (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      res.status(400).send({ message: err.message});
    }

    res.status(200).send({
      message: "Image uploaded successfully",
      image: `/${req.file.path}`,
    });
  });
});

export default router;