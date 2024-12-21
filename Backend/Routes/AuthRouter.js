import { Router } from 'express';
import { signupValidation, loginValidation } from '../Middlewares/AuthValidation.js';
import { signup, login } from '../Controllers/AuthController.js';

const authRouter = Router();

authRouter.post('/login', loginValidation, login);

authRouter.post('/signup', signupValidation, signup);

export default authRouter;