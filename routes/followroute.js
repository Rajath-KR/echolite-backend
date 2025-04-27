import express from 'express';
import {
  followUser,
  unfollowUser,
  getUserProfile,
  authMiddleware
} from '../controllers/follow.js';

const router = express.Router();

router.post('/follow/:userId', authMiddleware, followUser);
router.post('/unfollow/:userId', authMiddleware, unfollowUser);
router.get('/user/:username', getUserProfile);

export default router;