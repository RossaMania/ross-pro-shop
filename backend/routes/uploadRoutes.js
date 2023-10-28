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

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/; // The filetypes we want to allow.
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check the file extension name.
  const mimetype = filetypes.test(file.mimetype); // Check the file mimetype (the type of file) to see if it matches the filetypes we want to allow.
  // If the file extension name and the file mimetype match the filetypes we want to allow, return true.
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Oops! Images only!"); //If the file is not an image, return an error message.
  }
}

// The upload object is the multer object that we will use to upload the image.
const upload = multer({
  storage,
})

// This is the route. The upload.single() method is a middleware that will accept a single file with the name image.
router.post("/", upload.single("image"), (req, res) => {
  res.send({
    message: "Yay! Image uploaded!", // A message to send back to the frontend.
    image: `/${req.file.path}` // The path to the image.
  });
});

export default router;