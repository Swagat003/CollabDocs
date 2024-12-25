import { Router } from 'express';
import { signupValidation, loginValidation } from '../Middlewares/AuthValidation.js';
import { signup, login } from '../Controllers/AuthController.js';
import { ensureAuthenticity } from '../Middlewares/Auth.js';

const authRouter = Router();

authRouter.post('/login', loginValidation, login);

authRouter.post('/signup', signupValidation, signup);

authRouter.post('/verify', ensureAuthenticity);

export default authRouter;