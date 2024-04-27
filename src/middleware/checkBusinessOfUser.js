/* eslint-disable camelcase */
import { matchedData } from 'express-validator';
import models from '../models/index.js';
import handleHttpError from '../utils/handleError.js';
import { typeOfRoles } from '../config/constants.js';

const checkBusinessOfUser = async (req, res, next) => {
  const { id } = matchedData(req);
  const user_id = req.session.user.id;
  const { roles } = req.session;

  const consultaBD = await models.users_businessModel.findOne({
    where: { id },
  });
  if (roles.includes(typeOfRoles.admin.id)) {
    next();
  } else if (consultaBD.user_id === user_id) {
    next();
  } else {
    handleHttpError(res, 'No tienes permisos para realizar esta acción.', 401);
  }
};

export default checkBusinessOfUser;
