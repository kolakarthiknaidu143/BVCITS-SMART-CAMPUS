import { Router } from 'express';
import { registerUser, loginUser, demoLoginUser, getCurrentUser, logoutUser } from '../controllers/authController';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/demo-login', demoLoginUser);
router.get('/me', verifyToken, getCurrentUser);
router.post('/logout', verifyToken, logoutUser);

export default router;

