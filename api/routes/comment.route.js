import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { likeComment,editComment, getcomments,deleteComment,createComment,getPostComments} from '../controllers/comment.controller.js';

const router = express.Router();

// You need to verify your token before you want to comment anything
router.post('/create', verifyToken, createComment);
// Anyone can see the post comment whether he is admin/user or even if he is sign-out
router.get('/getPostComments/:postId', getPostComments);
//User need to verify before liking any comment.
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.put('/editComment/:commentId', verifyToken, editComment);
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);
router.get('/getcomments', verifyToken, getcomments);

export default router;