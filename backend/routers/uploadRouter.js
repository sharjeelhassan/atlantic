import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import express from 'express';
import { isAuth } from '../utils.js';
import config from '../config.js';

const uploadRouter = express.Router();

// Disk Storage
/**************************************************/

// Disk Storage Setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});
/**************************************************/


// AWS S3 Storage
/**************************************************/

// AWS SDK Configuration
aws.config.update({
  asscessKeyId: config.asscessKeyId,
  secretAccessKey: config.secretAccessKey,
});

const s3 = new aws.S3();

// AWS S3 Setup
const storageS3 = multerS3({
  s3,
  bucket: 'atlantic-bucket',
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadS3 = multer({ storage: storageS3 });

uploadRouter.post('/s3', uploadS3.single('image'), (req, res) => {
  res.send(req.file.location);
});
/**************************************************/

export default uploadRouter;
