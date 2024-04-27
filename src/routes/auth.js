import express from 'express';
import {
  loginCtrl,
  signUpCtrl,
  logoutCtrl,
  emailVerifyCtrl,
  ckeckSessCtrl,
  employeeLoginCtrl,
} from '../controllers/auth.controller.js';
import {
  validatorLogin,
  validatorSignUp,
  validatorGetToken,
  validatorLoginEmployee,
} from '../validators/auth.js';
import { isLoggedInTrue, isLoggedInFalse } from '../middleware/isLoggedIn.js';
import checkEmailExist from '../middleware/checkEmailExist.js';

const router = express.Router();

router.post('/login', isLoggedInFalse, validatorLogin, loginCtrl);
router.post(
  '/login-employee',
  isLoggedInFalse,
  validatorLoginEmployee,
  employeeLoginCtrl,
);
router.post('/signup', validatorSignUp, checkEmailExist, signUpCtrl);
router.get('/logout', isLoggedInTrue, logoutCtrl);
router.get('/email-verification/:token', validatorGetToken, emailVerifyCtrl);
router.get('/check-session', ckeckSessCtrl);

export default router;
