import express from 'express';
import multer from 'multer';
import path from 'path';

import { handlePostDet, handlePostDetGet } from '../controllers/postDet.js';

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'post/Images');
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

router.post('/', upload.single('postImage'), handlePostDet);

router.get('/', handlePostDetGet);

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});

export default router;
