import express from 'express';
import { 
  addComment, 
  getCommentsByPost, 
  deleteComment 
} from '../controllers/comment.js';

const router = express.Router();

router.post('/', addComment);
router.get('/post/:postId', getCommentsByPost);
router.delete('/:commentId', deleteComment);

export default router;