import { check } from 'express-validator';
import validateResults from '../utils/handleValidator.js';

const validatorGetProductsAndServicesByClient = [
  check('business_id').exists().isNumeric().notEmpty(),

  (req, res, next) => validateResults(req, res, next),
];
const validatorProductsAndServicesUpdateDefault = [
  check('id').exists().isNumeric().notEmpty(),

  (req, res, next) => validateResults(req, res, next),
];
const validatorGetProductsAndServicesUpdateByClient = [
  check('id').exists().isNumeric(),
  check('user_id').exists().isNumeric(),
  check('name').exists().isString().notEmpty(),
  check('description').exists().isString().notEmpty(),
  check('unit').exists().isString().notEmpty(),
  check('unit_price').exists().isString().notEmpty(),
  check('code').exists().isString().notEmpty(),
  check('type').exists().isString().notEmpty(),
  check('inventory_control').exists().isBoolean(),
  check('default').exists().isBoolean(),
  check('business_id').exists().isNumeric(),
  (req, res, next) => validateResults(req, res, next),
];

export {
  validatorGetProductsAndServicesByClient,
  validatorGetProductsAndServicesUpdateByClient,
  validatorProductsAndServicesUpdateDefault,
};
