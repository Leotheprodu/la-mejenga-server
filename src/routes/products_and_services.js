import express from 'express';
import { isLoggedInTrue } from '../middleware/isLoggedIn.js';
import {
  validatorGetProductsAndServicesByClient,
  validatorGetProductsAndServicesUpdateByClient,
  validatorProductsAndServicesUpdateDefault,
} from '../validators/products_and_services.js';
import {
  productsAndServicesByClientCtrl,
  productsAndServicesUpdateCtrl,
  productsAndServicesCreateCtrl,
  productsAndServicesDefaultUpdateCtrl,
} from '../controllers/products_and_services.controller.js';

const router = express.Router();
router.get(
  '/:business_id',
  isLoggedInTrue,
  validatorGetProductsAndServicesByClient,
  productsAndServicesByClientCtrl,
);
router.put(
  '/',
  isLoggedInTrue,
  validatorGetProductsAndServicesUpdateByClient,
  productsAndServicesUpdateCtrl,
);
router.post(
  '/',
  isLoggedInTrue,
  validatorGetProductsAndServicesUpdateByClient,
  productsAndServicesCreateCtrl,
);
router.patch(
  '/:id',
  isLoggedInTrue,
  validatorProductsAndServicesUpdateDefault,
  productsAndServicesDefaultUpdateCtrl,
);

export default router;
