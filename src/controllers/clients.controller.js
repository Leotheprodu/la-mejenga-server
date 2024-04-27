/* eslint-disable camelcase */
import { matchedData } from 'express-validator';
import models from '../models/index.js';
import handleHttpError from '../utils/handleError.js';
import { resOkData } from '../utils/handleOkResponses.js';
import {
  findBalancesToDelete,
  findBalancesToCreate,
  deleteBalances,
  createBalances,
} from '../services/clients.js';
import createActivityLog from '../utils/handleActivityLog.js';

const clientsCtrl = async (req, res) => {
  const { active } = matchedData(req);
  try {
    const filtro = {
      where: { parent_user_id: req.session.user.id },
      order: [['username', 'ASC']],
      include: [
        {
          model: models.balancesModel,
          attributes: ['id', 'amount', 'active'],
          include: [
            {
              model: models.users_businessModel,
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    };
    if (active === 'true') {
      filtro.where.active = true;
    } else if (active === 'false') {
      filtro.where.active = false;
    }
    const clientsData = await models.clientsModel.findAll(filtro);
    resOkData(res, clientsData);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al intentar mostrar clientes');
  }
};
const clientCtrl = async (req, res) => {
  const { id } = matchedData(req);
  try {
    const clientsData = await models.clientsModel.findOne({
      where: { parent_user_id: req.session.user.id, id },
    });
    resOkData(res, clientsData);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al intentar mostrar el cliente');
  }
};
const dashboardClientCtrl = async (req, res) => {
  const { token, pin: pinData } = matchedData(req);

  console.log(token, pinData);
  try {
    const clientData = await models.clientsModel.scope('withPin').findOne({
      where: { token },
      attributes: {
        exclude: [
          'parent_user_id',
          'createdAt',
          'updatedAt',
          'detail',
          'token',
          'address',
        ],
      },
    });

    const { pin, ...client } = clientData.dataValues;
    if (!pin) {
      clientData.update({ pin: pinData });
      handleHttpError(res, 'New PIN');
      return;
    }
    if (pin !== pinData) {
      handleHttpError(res, 'Invalid PIN');
      return;
    }
    const balances = await models.balancesModel.findAll({
      where: { client_id: client.id, active: true },
      attributes: {
        exclude: ['client_id', 'business_id', 'createdAt', 'updatedAt'],
      },
      include: [
        {
          model: models.users_businessModel,
          attributes: ['id', 'name'],
          include: [
            {
              model: models.user_payment_methodsModel,
              attributes: {
                exclude: [
                  'payment_method_id',
                  'business_id',
                  'createdAt',
                  'updatedAt',
                ],
              },
              include: [
                {
                  model: models.payment_methodsModel,
                  attributes: ['id', 'name'],
                },
              ],
            },
            {
              model: models.usersModel,
              attributes: ['country', 'username', 'email', 'cellphone'],
            },
          ],
        },
      ],
    });
    resOkData(res, { client, balances });
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al intentar mostrar datos del cliente');
  }
};
const createClientsCtrl = async (req, res) => {
  const data = matchedData(req);
  const { id_business } = data;
  try {
    const clientData = await models.clientsModel.create({
      ...data,
      parent_user_id: req.session.user.id,
    });
    console.log(data);
    const createBalancesPromises = id_business.map(async (id) => {
      try {
        await models.balancesModel.create({
          client_id: clientData.id,
          business_id: id,
          amount: 0,
        });
      } catch (error) {
        console.log(error);
        handleHttpError(res, 'Error al crear balances en el negocio');
      }
    });

    await Promise.all(createBalancesPromises);
    await createActivityLog(req, 'client-create', clientData.id);
    resOkData(res, clientData);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al intentar crear cliente');
  }
};

const updateClientsCtrl = async (req, res) => {
  const data = matchedData(req);
  const { id_business } = data;
  const clientId = data.id;
  try {
    // Actualizar datos del cliente
    const clientData = await models.clientsModel.findOne({
      where: { id: clientId },
    });

    if (!clientData) {
      handleHttpError(res, 'El cliente no existe', 404);
      return;
    }
    if (clientData.parent_user_id !== req.session.user.id) {
      handleHttpError(res, 'No tienes permisos para editar este cliente', 403);
      return;
    }
    await clientData.update(data);

    // Obtener los balances existentes del cliente
    const existingBalances = await models.balancesModel.findAll({
      where: { client_id: clientId },
    });
    // Identificar los IDs de balances a borrar (amount igual a 0)
    const balancesToDelete = await findBalancesToDelete(
      existingBalances,
      id_business,
    );
    // Identificar los nuevos balances a crear
    const balancesToCreate = await findBalancesToCreate(
      existingBalances,
      id_business,
    );

    // Realizar la eliminación de balances (solo si amount es igual a 0)
    await deleteBalances(balancesToDelete);

    // Realizar la creación de nuevos balances
    await createBalances(clientId, balancesToCreate);
    await createActivityLog(req, 'client-update', clientId);
    resOkData(res, { message: 'Cliente actualizado correctamente' });
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al actualizar cliente');
  }
};

const deactivateClientsCtrl = async (req, res) => {
  const { id } = matchedData(req);

  try {
    const client = await models.clientsModel.findOne({ where: { id } });
    const { active } = client;
    const [updatedRowCount] = await models.clientsModel.update(
      { active: active === 0 ? 1 : 0 },
      { where: { id } },
    );
    if (updatedRowCount === 0) {
      handleHttpError(
        res,
        active === 0
          ? 'No se pudo activar el cliente'
          : 'No se pudo desactivar el cliente',
      );
      return;
    }
    await createActivityLog(req, 'client-deactivate', client.id);
    resOkData(res, {
      message:
        active === 0
          ? 'Cliente activado correctamente'
          : 'Cliente desactivado correctamente',
    });
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al intentar activar/desactivar cliente');
  }
};

export {
  clientsCtrl,
  createClientsCtrl,
  deactivateClientsCtrl,
  updateClientsCtrl,
  clientCtrl,
  dashboardClientCtrl,
};
