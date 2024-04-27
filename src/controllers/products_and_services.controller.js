/* eslint-disable camelcase */
import { matchedData } from 'express-validator';
import models from '../models/index.js';
import handleHttpError from '../utils/handleError.js';
import { resOkData } from '../utils/handleOkResponses.js';

const productsAndServicesByClientCtrl = async (req, res) => {
  const { business_id } = matchedData(req);
  const user_id = req.session.user.id;
  try {
    if (business_id === 0) {
      handleHttpError(res, 'El business id no puede ser 0', 400);
      return;
    }
    const products_and_services =
      await models.products_and_servicesModel.findAll({
        where: { business_id, user_id },
        attributes: {
          exclude: ['createdAt', 'updateAt'],
        },
      });
    resOkData(res, products_and_services);
  } catch (error) {
    console.log(error);
    handleHttpError(
      res,
      'Error al obtener los productos y servicios del cliente',
    );
  }
};
const productsAndServicesUpdateCtrl = async (req, res) => {
  const data = matchedData(req);
  const user_id = req.session.user.id;
  try {
    if (data.user_id !== user_id) {
      handleHttpError(
        res,
        'No puedes actualizar productos de otro usuario',
        400,
      );
      return;
    }
    const products_and_services =
      await models.products_and_servicesModel.findOne({
        where: { id: data.id },
      });
    if (!products_and_services) {
      handleHttpError(res, 'El producto o servicio no existe', 404);
      return;
    }
    if (products_and_services.user_id !== user_id) {
      handleHttpError(
        res,
        'No puedes actualizar productos de otro usuario',
        400,
      );
      return;
    }
    if (products_and_services.business_id !== data.business_id) {
      handleHttpError(
        res,
        'No puedes actualizar productos de otro negocio',
        400,
      );
      return;
    }
    await products_and_services.update(data);
    resOkData(res, { message: 'Producto o servicio actualizado' });
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al actualizar producto o servicio del cliente');
  }
};
const productsAndServicesCreateCtrl = async (req, res) => {
  const reqData = matchedData(req);
  // eslint-disable-next-line no-unused-vars
  const { id, ...data } = reqData;
  const user_id = req.session.user.id;
  try {
    if (data.user_id !== user_id) {
      handleHttpError(
        res,
        'No puedes actualizar productos de otro usuario',
        400,
      );
      return;
    }
    const business = await models.users_businessModel.findOne({
      where: { id: data.business_id },
    });
    if (!business) {
      handleHttpError(res, 'El negocio no existe', 404);
      return;
    }
    if (business.user_id !== user_id) {
      handleHttpError(
        res,
        'No puedes actualizar el negocio de otro usuario',
        400,
      );
      return;
    }
    await models.products_and_servicesModel.create(data);
    resOkData(res, { message: 'Producto o servicio creado' });
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al crear el producto o servicio del cliente');
  }
};
const productsAndServicesDefaultUpdateCtrl = async (req, res) => {
  const { id } = matchedData(req);
  const user_id = req.session.user.id;
  try {
    const products_and_services =
      await models.products_and_servicesModel.findOne({
        where: { id },
      });
    if (!products_and_services) {
      handleHttpError(res, 'El producto o servicio no existe', 404);
      return;
    }
    if (products_and_services.user_id !== user_id) {
      handleHttpError(
        res,
        'No puedes actualizar productos de otro usuario',
        400,
      );
      return;
    }
    if (products_and_services.default) {
      handleHttpError(
        res,
        'No puedes actualizar el producto o servicio por defecto',
        400,
      );
      return;
    }
    const defaultProduct_or_service =
      await models.products_and_servicesModel.findOne({
        where: {
          user_id,
          default: true,
          business_id: products_and_services.business_id,
        },
      });
    if (defaultProduct_or_service) {
      await defaultProduct_or_service.update({ default: false });
    }
    await products_and_services.update({
      default: !products_and_services.default,
    });
    resOkData(res, { message: 'Producto o servicio actualizado' });
  } catch (error) {
    console.log(error);
    handleHttpError(
      res,
      'Error al actualizar el producto o servicio del cliente',
    );
  }
};
export {
  productsAndServicesByClientCtrl,
  productsAndServicesUpdateCtrl,
  productsAndServicesCreateCtrl,
  productsAndServicesDefaultUpdateCtrl,
};
