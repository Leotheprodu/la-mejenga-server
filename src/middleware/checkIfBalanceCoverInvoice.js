import { matchedData } from 'express-validator';
import handleHttpError from '../utils/handleError.js';
import { billingPrice } from '../config/constants.js';

const checkIfBalanceCoverInvoice = (req, res, next) => {
  const { total } = matchedData(req);
  const { balance } = req.session;
  if (total === 0) {
    handleHttpError(res, 'El total de la factura no puede ser 0');
    return;
  }

  if (
    balance >= total * billingPrice ||
    req.session.roles.includes(1) ||
    req.session.roles.includes(4)
  ) {
    next();
  } else {
    handleHttpError(
      res,
      `No tiene suficiente saldo para registrar la factura. Su saldo es de ${balance.toFixed(
        2,
      )} y el total a deducir es ${(total * billingPrice).toFixed(2)}`,
    );
  }
};
export default checkIfBalanceCoverInvoice;
