import handleHttpError from '../utils/handleError.js';
import models from '../models/index.js';

export const checkPin = async (req, res, next) => {
  const { token } = req.params;
  const { pin } = req.body;
  const clientData = await models.clientsModel.scope('withPin').findOne({
    where: { token },
    attributes: ['pin'],
  });
  if (!clientData) {
    handleHttpError(res, 'Token no encontrado');
    return;
  }
  if (!clientData.pin && !pin) {
    handleHttpError(res, 'No PIN');
    return;
  }
  if (clientData.pin && !pin) {
    handleHttpError(res, 'Si PIN');
    return;
  }
  next();
};

export default checkPin;
