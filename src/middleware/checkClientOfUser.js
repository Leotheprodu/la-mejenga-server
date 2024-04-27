import { matchedData } from 'express-validator';
import models from '../models/index.js';
import handleHttpError from '../utils/handleError.js';

const checkClientOfUser = async (req, res, next) => {
  try {
    const { id } = matchedData(req);
    const consultaBD = await models.clientsModel.findOne({
      where: { id },
    });

    if (consultaBD.parent_user_id === req.session.user.id) {
      next();
    } else {
      handleHttpError(
        res,
        'No tienes permiso, el cliente no le pertenece',
        401,
      );
    }
  } catch (error) {
    console.log(error);
    handleHttpError(
      res,
      'Error al verificar si el cliente pertenece al usuario',
    );
  }
};

export default checkClientOfUser;
