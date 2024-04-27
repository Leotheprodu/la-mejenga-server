import express from 'express';
import {
  businessByUserCtrl,
  favoriteBusinessCtrl,
  createBusinessCtrl,
  deactivateBusinessCtrl,
  updateBusinessCtrl,
} from '../controllers/users_business.controller.js';
import { isLoggedInTrue } from '../middleware/isLoggedIn.js';
import {
  validatorGetBussiness,
  validatorGetFavoriteBussiness,
  validatorCreateBusiness,
  validatorUpdateBussiness,
} from '../validators/business.js';
import checkBusinessOfUser from '../middleware/checkBusinessOfUser.js';

const router = express.Router();
router.get('/', isLoggedInTrue, validatorGetBussiness, businessByUserCtrl);
router.post('/', isLoggedInTrue, validatorCreateBusiness, createBusinessCtrl);
router.get(
  '/favorite/:id',
  isLoggedInTrue,
  validatorGetFavoriteBussiness,
  checkBusinessOfUser,
  favoriteBusinessCtrl,
);
router.get(
  '/deactivate/:id',
  isLoggedInTrue,
  validatorGetFavoriteBussiness,
  checkBusinessOfUser,
  deactivateBusinessCtrl,
);
router.post(
  '/:id',
  isLoggedInTrue,
  validatorUpdateBussiness,
  checkBusinessOfUser,
  updateBusinessCtrl,
);

export default router;
