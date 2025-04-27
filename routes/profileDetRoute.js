import express from 'express';
import multer from 'multer';
import path from 'path';

import {
  handleProfilePost,
  handleProfileGet,
  handleProfileUpdate,
  handleProfileDelete,
} from '../controllers/profileDetails.js';

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'profile/Images');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/', upload.single('profileImage'), handleProfilePost);

router.get('/', handleProfileGet);

router.put('/:id', upload.single('profileImage'), handleProfileUpdate);

router.delete('/:id', handleProfileDelete);

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});

export default router;
