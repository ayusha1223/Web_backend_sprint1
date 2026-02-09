import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

import { v4 as uuidv4 } from "uuid";
import { HttpError } from "../errors/http-error";

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads");

    // Create uploads folder if it does not exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// Allow only image files
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new HttpError(400, "Only image files are allowed"));
  }
};

// Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

export default upload;
