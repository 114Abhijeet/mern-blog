import express from 'express';
import { deleteUser,test,signout, updateUser,getUsers,getUser} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();

//If you see carefully here we just passed test functions whose logic we described in user.controller.js..Therefore 
// its name sounds good.Main purpose of this to enhance readability and make sure your user.route.js file is clean
router.get('/test', test);
router.put('/update/:userId', verifyToken,updateUser);
router.delete('/delete/:userId', verifyToken,deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
//This getUser api route is not for admin purpose.It is only for getting User Info to show the comments on 
// specific post like which user has commented,their profile pic,username etc.
router.get('/:userId', getUser);

export default router;