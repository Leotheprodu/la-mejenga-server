/* eslint-disable camelcase */
import models from '../models/index.js';

// Función para identificar los balances a borrar
async function findBalancesToDelete(existingBalances, id_business) {
  const activeBalances = existingBalances.filter(
    (balance) => balance.active === true,
  );
  const balancesToDelete = activeBalances
    .filter((balance) => !id_business.includes(balance.business_id))
    .map((balance) => balance.id);
  return balancesToDelete;
}

// Función para identificar los nuevos balances a crear
async function findBalancesToCreate(existingBalances, id_business) {
  const balancesToCreateFiltered = id_business.filter(
    (id) =>
      !existingBalances.some(
        (existingBalance) => existingBalance.business_id === id,
      ),
  );
  const balancesToActivate = id_business.filter((id) =>
    existingBalances.some(
      (existingBalance) =>
        existingBalance.business_id === id && existingBalance.active === false,
    ),
  );
  const balancesToCreate = {
    toCreate: balancesToCreateFiltered,
    toActivate: balancesToActivate,
  };
  return balancesToCreate;
}

// Función para eliminar balances
async function deleteBalances(balancesToDelete) {
  await Promise.all(
    balancesToDelete.map(async (balance) => {
      await models.balancesModel.update(
        { active: false },
        {
          where: { id: balance, amount: 0 },
        },
      );
    }),
  );
}

// Función para crear nuevos balances
async function createBalances(clientId, balancesToCreate) {
  const { toCreate, toActivate } = balancesToCreate;
  await Promise.all(
    toCreate.map(async (business_id) => {
      await models.balancesModel.create({
        client_id: clientId,
        business_id,
        amount: 0,
      });
    }),
  );
  await Promise.all(
    toActivate.map(async (business_id) => {
      await models.balancesModel.update(
        {
          active: true,
        },
        { where: { business_id } },
      );
    }),
  );
}
export {
  findBalancesToDelete,
  findBalancesToCreate,
  deleteBalances,
  createBalances,
};
