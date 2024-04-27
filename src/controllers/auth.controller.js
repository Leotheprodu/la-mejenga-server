import { matchedData } from 'express-validator';
import models from '../models/index.js';
import UsersService from '../services/users.service.js';
import handleHttpError from '../utils/handleError.js';
import { PasswordCompare, PasswordEncrypt } from '../utils/handlePassword.js';
import { resUsersSessionData, resOkData } from '../utils/handleOkResponses.js';
import { createTempToken, newToken } from '../utils/handleTempToken.js';
import sendAEmail from '../utils/handleSendEmail.js';
import idGenerator from '../utils/idGenerator.js';
import {
  initialBalance,
  appName,
  emailUser,
  verifyEmailLink,
  paymentMethod,
  BusinessConfigInfo,
  paymentStatus,
} from '../config/constants.js';
import userBusinessChecker from '../utils/userBusinessChecker.js';
import cookieSessionInject from '../utils/handleCookie.js';
import createActivityLog from '../utils/handleActivityLog.js';

const users = new UsersService();

const loginCtrl = async (req, res) => {
  try {
    const data = matchedData(req);
    const { email, password } = data;
    const userData = await users.findUserWithPasswordByEmail(email);

    if (!userData) {
      handleHttpError(res, 'El usuario no existe', 404);
      return;
    }
    if (userData.active === 0) {
      handleHttpError(res, 'El usuario esta desactivado', 401);
      return;
    }
    const hashPassword = await userData.password;
    const check = await PasswordCompare(password, hashPassword);
    if (!check) {
      handleHttpError(res, 'Contraseña Incorrecta', 401);
      return;
    }
    cookieSessionInject(req, res);
    userData.set('password', undefined, { strict: false });
    await userBusinessChecker(req, userData.id);
    req.session.user = userData;
    req.session.isLoggedIn = true;
    req.session.employee = {
      isEmployee: false,
      isAdmin: true,
      active: false,
      employeeName: '',
    };
    resUsersSessionData(req, res);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error durante el inicio de sesion');
  }
};

const employeeLoginCtrl = async (req, res) => {
  try {
    const data = matchedData(req);
    const { username, password } = data;
    const employeeData =
      await users.findEmployeeWithPasswordByUsername(username);

    if (!employeeData) {
      handleHttpError(res, 'El empleado no existe', 404);
      return;
    }
    if (employeeData.active === 0) {
      handleHttpError(res, 'El Empleado no esta activo', 401);
      return;
    }
    const hashPassword = await employeeData.password;
    const check = await PasswordCompare(password, hashPassword);
    if (!check) {
      handleHttpError(res, 'Contraseña Incorrecta', 401);
      return;
    }
    cookieSessionInject(req, res);
    const userData = await models.usersModel.findOne({
      where: { id: employeeData.parent_user_id },
    });
    await userBusinessChecker(req, userData.id);
    req.session.user = userData;
    req.session.isLoggedIn = true;
    req.session.employee = {
      isEmployee: true,
      isAdmin: employeeData?.admin,
      active: employeeData?.active,
      employeeName: employeeData?.username,
    };
    await createActivityLog(req, 'employee-login', employeeData.id);
    resUsersSessionData(req, res);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error durante el inicio de sesion');
  }
};

const logoutCtrl = async (req, res) => {
  try {
    req.session.isLoggedIn = false;
    resUsersSessionData(req, res, 'El Usuario ha cerrado sesion');
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al cerrar sesion');
  }
};

const signUpCtrl = async (req, res) => {
  try {
    const reqData = matchedData(req);
    const { address, ...restOfReq } = reqData;
    const password = await PasswordEncrypt(reqData.password);
    const body = { ...restOfReq, password };
    const { username, email } = body;
    const data = await models.usersModel.create(body);
    if (!data) {
      handleHttpError(res, 'Error creando usuario');
      return;
    }
    const token = await newToken();
    const link = `${verifyEmailLink}${token}`;
    const from = {
      name: `${appName}`,
      email: `${emailUser}`,
    };
    const dataToEJS = { username, link };
    await createTempToken(token, email, 'sign_up');
    await sendAEmail(
      'user-sign_up',
      dataToEJS,
      from,
      email,
      `Bienvenido(a) a ${appName}`,
    );
    const appClient = {
      username,
      email,
      cellphone: data.cellphone,
      token: `${data.username.toLowerCase().slice(0, 2)}-${idGenerator()}`,
      user_id: data.id,
      parent_user_id: BusinessConfigInfo.userId,
      country: data.country,
      address,
    };
    const userClient = {
      username: 'Cliente 1',
      token: `cp-${idGenerator()}`,
      parent_user_id: data.id,
      country: data.country,
    };
    data.set('password', undefined, { strict: false });
    await models.role_usersModel.create({ user_id: data.id, role_id: 3 });
    const newUserBusiness = await models.users_businessModel.create({
      user_id: data.id,
      name: `Negocio de ${data.username}`,
      default: true,
    });
    await models.products_and_servicesModel.create({
      user_id: data.id,
      name: 'Predeterminado',
      description: 'Servicio predeterminado',
      unit: 'unidad',
      unit_price: 1,
      default: true,
      business_id: newUserBusiness.id,
      code: `${data.id}-${newUserBusiness.id}-1`,
      type: 'service',
    });
    const client = await models.clientsModel.create(appClient);
    const userBalance = await models.balancesModel.create({
      client_id: client.id,
      business_id: BusinessConfigInfo.businessId,
      amount: initialBalance,
    });
    const userClientData = await models.clientsModel.create(userClient);
    await models.balancesModel.create({
      client_id: userClientData.id,
      business_id: newUserBusiness.id,
      amount: 0,
    });
    const userPaymentMethod = await models.user_payment_methodsModel.create({
      payment_method_id: paymentMethod.cash.id,
      business_id: newUserBusiness.id,
      payment_method_cellphone: client.cellphone || null,
      payment_method_email: client.email,
      payment_method_description: ' pago en efectivo',
    });
    await models.balances_rechargesModel.create({
      amount: 0,
      balance_amount: initialBalance,
      status: paymentStatus.completed.name,
      client_id: client.id,
      balance_id: userBalance.id,
      user_payment_methods_id: userPaymentMethod.id,
      balances_types_id: 1,
    });
    req.session.user = data;
    req.session.isLoggedIn = false;
    req.session.employee = {
      isEmployee: false,
      isAdmin: true,
      active: false,
      employeeName: '',
    };
    cookieSessionInject(req, res);
    await createActivityLog(req, 'user-signup', data.id);
    resOkData(res, data);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error creando usuario');
  }
};

const emailVerifyCtrl = async (req, res) => {
  const { token } = matchedData(req);
  const tempToken = async () => {
    try {
      const result = await models.temp_token_poolModel.findOne({
        where: { token, type: 'sign_up' },
      });
      return result;
    } catch (error) {
      console.log(error);
      handleHttpError(res, 'Token invalido');
      return null;
    }
  };
  try {
    const tempTokenData = await tempToken(token);
    const userData = await models.usersModel.findOne({
      where: { email: tempTokenData.user_email },
    });
    if (!userData) {
      handleHttpError(res, 'El usuario no existe', 404);
      return;
    }
    const unverifiedRole = await models.role_usersModel.findOne({
      where: { user_id: userData.id, role_id: 3 },
    });
    await tempTokenData.destroy();
    await unverifiedRole.destroy();
    await models.role_usersModel.create({ user_id: userData.id, role_id: 2 });
    resOkData(res, userData);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error verificando correo electronico');
  }
};

const ckeckSessCtrl = async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      resUsersSessionData(req, res, 'Sesion activa');
    } else {
      handleHttpError(res, 'El usuario no ha iniciado sesion');
    }
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al verificar sesion');
  }
};

export {
  loginCtrl,
  employeeLoginCtrl,
  logoutCtrl,
  signUpCtrl,
  emailVerifyCtrl,
  ckeckSessCtrl,
};
