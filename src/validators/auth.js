import { check } from 'express-validator';
import validateResults from '../utils/handleValidator.js';

const validatorSignUp = [
  check('username').exists().notEmpty().isLength({ min: 3, max: 20 }),

  check('email').exists().notEmpty().isEmail(),

  check('password').exists().notEmpty().isString(),

  check('cellphone').exists().notEmpty().isInt(),

  check('country').exists().notEmpty().isString(),

  check('address').exists().notEmpty().isString(),

  (req, res, next) => validateResults(req, res, next),
];
const validatorLogin = [
  check('email').exists().notEmpty().isEmail(),

  check('password').exists().notEmpty().isString(),

  check('isEmployee').optional().isBoolean(),

  (req, res, next) => validateResults(req, res, next),
];
const validatorLoginEmployee = [
  check('username').exists().notEmpty().isString(),

  check('password').exists().notEmpty().isString(),

  check('isEmployee').optional().isBoolean(),

  (req, res, next) => validateResults(req, res, next),
];
const validatorEmail = [
  check('email').exists().notEmpty().isEmail(),
  (req, res, next) => validateResults(req, res, next),
];
const validatorRecoverPassword = [
  check('email').exists().notEmpty().isEmail(),

  check('password').exists().notEmpty().isString(),

  check('pin').exists().notEmpty().isString(),

  (req, res, next) => validateResults(req, res, next),
];

const validatorGetItem = [
  check('id').exists().isNumeric().notEmpty(),

  (req, res, next) => validateResults(req, res, next),
];
const validatorGetToken = [
  check('token').exists().isString().notEmpty(),

  (req, res, next) => validateResults(req, res, next),
];
const validatorGetEmail = [
  check('email').exists().isEmail().notEmpty(),

  (req, res, next) => validateResults(req, res, next),
];

const validatorUpdateUsers = [
  check('username').optional().isLength({ min: 3, max: 20 }),

  check('email').optional().isEmail(),

  check('password').optional().isString(),

  (req, res, next) => validateResults(req, res, next),
];
export {
  validatorLogin,
  validatorGetItem,
  validatorSignUp,
  validatorEmail,
  validatorRecoverPassword,
  validatorUpdateUsers,
  validatorGetEmail,
  validatorGetToken,
  validatorLoginEmployee,
};
