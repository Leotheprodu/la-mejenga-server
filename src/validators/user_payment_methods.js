import { check } from 'express-validator';
import validateResults from '../utils/handleValidator.js';

const validatorCreateUserPaymentMethods = [
  check('payment_method_full_name')
    .optional()
    .isString()
    .withMessage('El nombre del método de pago debe ser una cadena.'),
  check('payment_method_cellphone')
    .optional()
    .isString()
    .withMessage(
      'El número de teléfono del método de pago debe ser una cadena.',
    ),
  check('payment_method_iban')
    .optional()
    .isString()
    .withMessage('El IBAN del método de pago debe ser una cadena.'),
  check('payment_method_email')
    .optional()
    .isString()
    .withMessage(
      'El correo electrónico del método de pago debe ser una cadena.',
    ),
  check('payment_method_description')
    .optional()
    .isString()
    .withMessage('La descripción del método de pago debe ser una cadena.'),

  check('payment_method_id')
    .exists()
    .isInt()
    .withMessage(
      'El ID del método de pago es requerido y debe ser un número entero.',
    ),
  check('id')
    .exists()
    .isInt()
    .withMessage('El ID del negocio es requerido y debe ser un número entero.'),

  // Agrega más validaciones según tus necesidades

  (req, res, next) => validateResults(req, res, next),
];

// eslint-disable-next-line import/prefer-default-export
export { validatorCreateUserPaymentMethods };
