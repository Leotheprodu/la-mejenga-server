import { check } from 'express-validator';
import validateResults from '../utils/handleValidator.js';

const validatorCreateClients = [
  check('username')
    .exists()
    .notEmpty()
    .isString()
    .withMessage('El nombre de usuario debe ser una cadena de texto.'),
  check('email')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .notEmpty()
    .withMessage(
      'El email debe ser una dirección de correo electrónico válida.',
    ),
  check('cellphone')
    .optional({ nullable: true, checkFalsy: true })
    .isInt()
    .withMessage('El número de teléfono debe ser un número entero.'),
  check('token')
    .exists()
    .notEmpty()
    .isString()
    .withMessage('El token debe ser una cadena de texto.'),
  check('id_business')
    .exists()
    .isArray()
    .custom((values) => values.every(Number.isInteger))
    .withMessage(
      'Todos los elementos en id_business deben ser números enteros dentro de un array',
    ),
  check('country')
    .exists()
    .isString()
    .notEmpty()
    .withMessage('country debe ser un string'),
  check('address')
    .optional()
    .isString()
    .withMessage('address debe ser un string'),
  check('detail')
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('detail debe ser un string'),

  (req, res, next) => validateResults(req, res, next),
];
const validatorUpdateClients = [
  check('id').exists().notEmpty(),
  check('username').exists().notEmpty().isString(),
  check('email')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .notEmpty(),
  check('cellphone')
    .optional({ nullable: true, checkFalsy: true })
    .isInt()
    .withMessage('El número de teléfono debe ser un número entero.'),
  check('token').exists().notEmpty().isString(),
  check('id_business')
    .exists()
    .isArray()
    .withMessage('id_business debe ser un array.')
    .custom((values) => values.every(Number.isInteger))
    .withMessage(
      'Todos los elementos en id_business deben ser números enteros.',
    ),
  check('country')
    .exists()
    .isString()
    .notEmpty()
    .withMessage('country debe ser un string'),
  check('address')
    .optional()
    .isString()
    .withMessage('address debe ser un string'),
  check('detail')
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('detail debe ser un string'),
  (req, res, next) => validateResults(req, res, next),
];
const validatorDeactivateClient = [
  check('id').exists().notEmpty(),
  (req, res, next) => validateResults(req, res, next),
];
const validatorQueryClients = [
  check('active').optional().isBoolean(),
  (req, res, next) => validateResults(req, res, next),
];
const validatorGetClient = [
  check('id').exists().notEmpty(),
  (req, res, next) => validateResults(req, res, next),
];
const validatorDashboardClient = [
  check('token').exists().notEmpty(),
  check('pin').exists().notEmpty(),
  (req, res, next) => validateResults(req, res, next),
];
const validatorDashboardTransactions = [
  check('token').exists().notEmpty(),
  check('pin').exists().notEmpty(),
  check('invoice_id').exists().notEmpty().isInt(),
  (req, res, next) => validateResults(req, res, next),
];

export {
  validatorCreateClients,
  validatorDeactivateClient,
  validatorQueryClients,
  validatorUpdateClients,
  validatorGetClient,
  validatorDashboardClient,
  validatorDashboardTransactions,
};
