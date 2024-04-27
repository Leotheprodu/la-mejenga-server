import { typeOfRoles } from '../config/constants.js';
import handleHttpError from '../utils/handleError.js';

const isAdmin = (req, res, next) => {
  const { roles } = req.session;

  if (roles.includes(typeOfRoles.admin.id)) {
    next();
  } else {
    handleHttpError(res, 'No tienes permisos para realizar esta acción');
  }
};

export default isAdmin;
