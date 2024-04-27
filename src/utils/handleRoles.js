/* eslint-disable camelcase */
import models from '../models/index.js';

const refreshUserRoles = async (user_id) => {
  const results = await models.role_usersModel.findAll({
    where: { user_id },
  });
  const roles = results
    .map((obj) => obj.role_id)
    .filter((val) => val !== undefined);
  if (results === null || !roles.includes(2)) {
    await models.role_usersModel.create({
      user_id,
      role_id: 2,
    });
    const results2 = await models.role_usersModel.findAll({
      where: { user_id },
    });

    return results2
      .map((obj) => obj.role_id)
      .filter((val) => val !== undefined);
  }
  return results.map((obj) => obj.role_id).filter((val) => val !== undefined);
};
/**
 * los roles se necesitan crudos, directo desde el body de la solicitud, los rolesModificables es un array con los roles que se peude modificar
 * @param {req.body.id} user_id
 * @param {req.body.roles} rolesBody
 * @param {[1,2]} rolesModificables
 * @returns
 */
const addUserRoles = async (user_id, rolesBody, rolesModificables) => {
  const results = await models.role_usersModel.findAll({ where: { user_id } });
  const rolesBD = results
    .map((obj) => obj.role_id)
    .filter((val) => val !== undefined);

  const rolesReq = Array.isArray(rolesBody) ? rolesBody : [];

  const promises = rolesReq.map(async (role) => {
    if (!rolesModificables.includes(role) || rolesBD.includes(role)) {
      return null; // El rol no se puede modificar
    }
    // El rol no está asignado, agregarlo
    await models.role_usersModel.create(
      { user_id, role_id: role },
      { ignoreDuplicates: true },
    );

    return role;
  });

  // Eliminar roles no deseados
  const promises2 = rolesBD
    .filter(
      (role) => !rolesReq.includes(role) && rolesModificables.includes(role),
    )
    .map(async (role) => {
      await models.role_usersModel.destroy({
        where: { user_id, role_id: role },
      });
      return role;
    });
  const rolesActualizados = await Promise.all([...promises, ...promises2]);

  if (rolesActualizados) {
    const results2 = await models.role_usersModel.findAll({
      where: { user_id },
    });
    return results2
      .map((obj) => obj.role_id)
      .filter((val) => val !== undefined);
  }
  return null;
};

export { refreshUserRoles, addUserRoles };
