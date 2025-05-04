
import { signup, signin } from '../controllers/user.js';
import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

router.get('/me', protect, (req, res) => {
  res.json({
    message: 'Protected route accessed successfully',
    user: req.user
  });
});

export default router;