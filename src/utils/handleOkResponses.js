import handleHttpError from './handleError.js';
import RefreshSessionData from './handleRefreshSessionData.js';

/**
 * Respuesta para enviar toda la informacion de la sesion actual del usuario
 * @param {*} req
 * @param {*} res
 * @param {'mensaje de la respuesta'} message
 */
const resUsersSessionData = async (req, res) => {
  try {
    await RefreshSessionData(req);
    res.send({
      data: {
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
        roles: req.session.roles,
        client: req.session.client,
        balance: req.session.balance,
        employee: req.session.employee,
      },
    });
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al verificar sesion');
  }
};
/**
 * Respuesta para enviar unicamente datos para mostrar al cliente
 * @param {*} res
 * @param {object} data
 */
const resOkData = (res, data) => {
  res.send({ data });
};

export { resUsersSessionData, resOkData };
