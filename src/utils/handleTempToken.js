/* eslint-disable camelcase */
import crypto from 'crypto';
import models from '../models/index.js';

const newToken = async () => {
  try {
    return crypto.randomBytes(32).toString('hex');
  } catch (error) {
    console.log(error);
    throw new Error(`Ha habido un error al generar el token: ${error}`);
  }
};

function generateRandomPin(length) {
  if (length <= 0) {
    throw new Error('PIN debe ser mayor a 0');
  }

  const min = 10 ** (length - 1); // Valor mínimo basado en la longitud
  const max = 10 ** length - 1; // Valor máximo basado en la longitud
  const pin = Math.floor(Math.random() * (max - min + 1)) + min;

  return pin.toString().padStart(length, '0'); // Rellenar con ceros a la izquierda si es necesario
}
/**
 * aqui pasa el token, email del usuario y el tipo de registro
 * @param {*} token
 * @param {*} user_email
 * @param {*} type
 */
const createTempToken = async (token, user_email, type) => {
  const temp_token = await models.temp_token_poolModel.create({
    token,
    user_email,
    type,
  });
  const message = {
    message: 'token temporal guardado existosamente',
    temp_token,
  };
  return message;
};
/**
 * aqui pasa el token, email del usuario y el tipo de registro
 * @param {*} token
 * @param {*} user_email
 * @param {*} type
 */
const deleteTempToken = async (token, user_email, type) => {
  try {
    const temp_token = await models.temp_token_poolModel.findOne({
      where: { user_email, type, token },
    });
    if (!temp_token) return;

    await temp_token.destroy();
  } catch (error) {
    console.log(error);
  }
};
const deleteTempNoToken = async (user_email, type) => {
  try {
    const temp_token = await models.temp_token_poolModel.findOne({
      where: { user_email, type },
    });
    if (!temp_token) return;

    await temp_token.destroy();
  } catch (error) {
    console.log(error);
  }
};

export {
  newToken,
  generateRandomPin,
  createTempToken,
  deleteTempToken,
  deleteTempNoToken,
};
