import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create,  deletepost,getposts,updatepost  } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
// We don't want to verify the token here because any user even without authentication has ability to search
// for the post or see it in the homepage
router.get('/getposts', getposts)
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)
export default router;