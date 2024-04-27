import { matchedData } from 'express-validator';
import models from '../models/index.js';
import handleHttpError from '../utils/handleError.js';
import { resOkData } from '../utils/handleOkResponses.js';
import { BusinessConfigInfo, appName, emailUser } from '../config/constants.js';
import sendAEmail from '../utils/handleSendEmail.js';
import createActivityLog from '../utils/handleActivityLog.js';

const balanceByClientCtrl = async (req, res) => {
  const { id } = matchedData(req);

  try {
    const balance = await models.balancesModel.findAll({
      where: { client_id: id, active: true },
    });
    resOkData(res, balance);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al intentar mostrar el balance del cliente');
  }
};

const rechargeBalancesCtrl = async (req, res) => {
  const data = matchedData(req);
  try {
    const balance = await models.balances_rechargesModel.create(data);
    const from = {
      name: `${appName}`,
      email: `${emailUser}`,
    };
    const dataToEJS = {
      status: 'pendiente',
      amount: balance.amount,
      client: req.session.user.username,
      textoStatus:
        'Dentro de poco vamos a procesarla y te notificaremos por este medio.',
    };
    await sendAEmail(
      'balance-recharge-user',
      dataToEJS,
      from,
      req.session.user.email,
      `Nueva Recarga en ${appName}`,
    );
    await sendAEmail(
      'balance-recharge-user',
      { ...dataToEJS, textoStatus: 'nueva recarga del usuario, para aplicar' },
      from,
      'leovpc@gmail.com',
      `Nueva Recarga de ${req.session.user.username}`,
    );
    await createActivityLog(req, 'user-rechargeBalance', balance.id);
    resOkData(res, balance);
  } catch (error) {
    console.log(error);
    handleHttpError(
      res,
      'Error al intentar crear recarga de balance del cliente',
    );
  }
};

const applyBalanceRechargeCtrl = async (req, res) => {
  const { id } = matchedData(req);

  try {
    const balanceRecharge = await models.balances_rechargesModel.findOne({
      where: { id },
    });
    await balanceRecharge.update({ status: 'completed' });
    const balance = await models.balancesModel.findOne({
      where: {
        client_id: balanceRecharge.client_id,
        business_id: BusinessConfigInfo.businessId,
      },
    });
    const updatedBalance = await balance.update({
      amount: balance.amount * 1 + balanceRecharge.balance_amount * 1,
    });
    const client = await models.clientsModel.findByPk(
      balanceRecharge.client_id,
    );
    const from = {
      name: `${appName}`,
      email: `${emailUser}`,
    };
    const dataToEJS = {
      status: 'completada',
      amount: balanceRecharge.amount,
      client: client.username,
      textoStatus: `Hemos aplicado el saldo a tu cuenta ahora tienes ${updatedBalance.amount} de saldo, ya puedes continuar usando la app.`,
    };
    await sendAEmail(
      'balance-recharge-user',
      dataToEJS,
      from,
      client.email,
      `Recarga Procesada`,
    );
    await createActivityLog(req, 'user-applyBalance', balanceRecharge.id);
    resOkData(res, { status: 'completed', balance: balance.amount });
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al intentar aplicar el saldo al cliente');
  }
};

const cancelBalanceRechargeCtrl = async (req, res) => {
  const { id } = matchedData(req);

  try {
    const balanceRecharge = await models.balances_rechargesModel.findOne({
      where: { id },
    });
    await balanceRecharge.update({ status: 'cancelled' });
    await createActivityLog(req, 'user-cancelBalance', balanceRecharge.id);
    resOkData(res, { status: 'cancelled' });
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al intentar cancelar la recarga del cliente');
  }
};

const balancesRechargesCtrl = async (req, res) => {
  const { id } = matchedData(req);
  try {
    const balance = await models.balancesModel.findOne({
      where: { client_id: id, business_id: BusinessConfigInfo.businessId },
    });
    const recharges = await models.balances_rechargesModel.findAll({
      where: { client_id: id, balance_id: balance.id },
      attributes: {
        exclude: [
          'balance_id',
          'client_id',
          'user_payment_methods_id',
          'balances_types_id',
        ],
      },
      include: [
        {
          model: models.balances_typesModel,
          attributes: ['id', 'name'],
        },
        {
          model: models.clientsModel,
          attributes: ['id', 'username', 'cellphone', 'token', 'email'],
        },
        {
          model: models.balancesModel,
          attributes: ['id', 'amount'],
        },
        {
          model: models.user_payment_methodsModel,
          attributes: {
            exclude: [
              'user_id',
              'createdAt',
              'updatedAt',
              'payment_method_id',
              'business_id',
            ],
          },
          include: [
            {
              model: models.payment_methodsModel,
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: [['id', 'DESC']],
    });
    resOkData(res, recharges);
  } catch (error) {
    console.log(error);
    handleHttpError(
      res,
      'Error al intentar crear recarga de balance del cliente',
    );
  }
};

const getBalanceTypeCtrl = async (req, res) => {
  const { id } = matchedData(req);

  try {
    const balance = await models.balances_typesModel.findByPk(id);
    resOkData(res, balance);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al intentar mostrar el plan de Recarga');
  }
};

const ClientBalancesCtrl = async (req, res) => {
  try {
    const defaultUserBusiness = req.session.userBusiness;
    const balances = await models.balancesModel.findAll({
      where: { business_id: defaultUserBusiness },
    });

    resOkData(res, balances);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al intentar mostrar los balances');
  }
};

const getBalancesTypesCtrl = async (req, res) => {
  try {
    const balancesTypes = await models.balances_typesModel.findAll();

    resOkData(res, balancesTypes);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al intentar mostrar los planes de Recarga');
  }
};

export {
  balanceByClientCtrl,
  ClientBalancesCtrl,
  getBalancesTypesCtrl,
  getBalanceTypeCtrl,
  rechargeBalancesCtrl,
  balancesRechargesCtrl,
  applyBalanceRechargeCtrl,
  cancelBalanceRechargeCtrl,
};
