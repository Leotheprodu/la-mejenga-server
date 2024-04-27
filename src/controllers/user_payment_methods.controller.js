/* eslint-disable camelcase */
import { matchedData } from 'express-validator';
import models from '../models/index.js';
import handleHttpError from '../utils/handleError.js';
import { resOkData } from '../utils/handleOkResponses.js';
import createActivityLog from '../utils/handleActivityLog.js';

const paymentMethodsCtrl = async (req, res) => {
  const { business_id } = matchedData(req);
  try {
    const paymentMethods = await models.user_payment_methodsModel.findAll({
      where: { business_id },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'business_id', 'payment_method_id'],
      },
      include: [
        { model: models.payment_methodsModel },
        {
          model: models.users_businessModel,
          attributes: ['id', 'name', 'user_id'],
        },
      ],
    });
    resOkData(res, paymentMethods);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al obtener los métodos de pago del negocio');
  }
};
const createPaymentMethodsCtrl = async (req, res) => {
  const resp = matchedData(req);
  const data = {
    ...resp,
    business_id: parseInt(resp.id, 10),
    id: undefined,
  };
  try {
    const newPaymentMethod =
      await models.user_payment_methodsModel.create(data);
    await createActivityLog(
      req,
      'userPaymentMethod-create',
      newPaymentMethod.id,
    );
    resOkData(res, newPaymentMethod);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al crear el método de pago');
  }
};
export { paymentMethodsCtrl, createPaymentMethodsCtrl };
