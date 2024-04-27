import handleHttpError from '../utils/handleError.js';
import { resUsersSessionData } from '../utils/handleOkResponses.js';

const isLoggedInTrue = (req, res, next) => {
  const { isLoggedIn } = req.session;

  if (isLoggedIn === true) {
    next();
  } else {
    handleHttpError(res, 'El usuario no ha iniciado sesion');
  }
};

const isLoggedInFalse = async (req, res, next) => {
  const { isLoggedIn } = req.session;

  if (isLoggedIn === false || isLoggedIn === undefined) {
    next();
  } else {
    resUsersSessionData(req, res, 'El Usuario ha iniciado sesion');
  }
};

export { isLoggedInTrue, isLoggedInFalse };
