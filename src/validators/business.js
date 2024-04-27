import { check } from 'express-validator';
import validateResults from '../utils/handleValidator.js';

const validatorGetBussiness = [
  check('active').exists().isBoolean().notEmpty(),
  (req, res, next) => validateResults(req, res, next),
];
const validatorCreateBusiness = [
  check('name').exists().isString().notEmpty(),
  (req, res, next) => validateResults(req, res, next),
];
const validatorGetFavoriteBussiness = [
  check('id').exists().isInt().notEmpty(),
  (req, res, next) => validateResults(req, res, next),
];
const validatorUpdateBussiness = [
  check('id').exists().isInt().notEmpty(),
  check('name').exists().isString().notEmpty(),
  (req, res, next) => validateResults(req, res, next),
];

export {
  validatorGetBussiness,
  validatorGetFavoriteBussiness,
  validatorCreateBusiness,
  validatorUpdateBussiness,
};
