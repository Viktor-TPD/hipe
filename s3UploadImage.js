import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure multer for temporary disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store files temporarily in the uploads directory
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Create a unique filename
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Create upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only images
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Create the uploads directory if it doesn't exist
if (!fs.existsSync("uploads/")) {
  fs.mkdirSync("uploads/");
}

// Function to upload file to S3
export async function uploadToS3(file) {
  try {
    const fileStream = fs.createReadStream(file.path);

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: file.filename,
      Body: fileStream,
      ContentType: file.mimetype,
    };

    // Upload to S3
    await s3Client.send(new PutObjectCommand(params));

    // Delete local file after successful upload
    fs.unlinkSync(file.path);

    // Return the URL
    return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.filename}`;
  } catch (error) {
    // Delete local file in case of error
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
}

export default upload;
