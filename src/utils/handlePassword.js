import bcrypt from 'bcrypt';

const saltRounds = 10;

/**
 * Encriptar contraseña
 * @param {*} passwordPlain
 */
const PasswordEncrypt = async (passwordPlain) => {
  const hash = await bcrypt.hash(passwordPlain, saltRounds);
  return hash;
};

/**
 * Compara la contraseña encriptada con la contraseña plana
 * @param {*} passwordPlain
 * @param {*} hashPassword
 */
const PasswordCompare = async (passwordPlain, hashPassword) =>
  bcrypt.compare(passwordPlain, hashPassword);

export { PasswordCompare, PasswordEncrypt };
