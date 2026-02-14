import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // 🔥 Completely ignore original filename
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + ".jpg";

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
