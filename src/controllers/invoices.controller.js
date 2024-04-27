/* eslint-disable camelcase */
import { matchedData } from 'express-validator';
import models from '../models/index.js';
import handleHttpError from '../utils/handleError.js';
import { resOkData } from '../utils/handleOkResponses.js';
import Balances from '../services/balances.service.js';
import Invoices from '../services/invoices.service.js';
import {
  invoicesStatus,
  paymentStatus,
  paymentMethod,
} from '../config/constants.js';
import dateNow from '../utils/handleDate.js';
import createActivityLog from '../utils/handleActivityLog.js';

const invoices = new Invoices();
const balances = new Balances();
const createInvoiceCtrl = async (req, res) => {
  const data = matchedData(req);
  const {
    business_id,
    total,
    id,
    date,
    invoice_details,
    status = invoicesStatus.pending,
    payment_method_id = paymentMethod.cash.id,
  } = data;
  const user_id = req.session.user.id;
  try {
    // por cada elemento del array invoice_details cambiar en code por la concatenacion de user_id, business_id y code
    const updatedInvoiceDetails = invoice_details.map((element) => ({
      ...element,
      code: `${user_id}-${business_id}-${element.code}`,
    }));

    const createInvoice = await models.invoicesModel.create({
      parent_user_id: user_id,
      business_id,
      date,
      client_id: id,
      total_amount: total,
      status,
    });
    if (!createInvoice) {
      handleHttpError(res, 'Error al crear factura');
      return;
    }
    const createInvoicesDetailsPromises = updatedInvoiceDetails.map(
      async (invoiceDetail) => {
        try {
          await models.invoice_detailsModel.create({
            invoiceId: createInvoice.id,
            description: invoiceDetail.description,
            quantity: invoiceDetail.quantity,
            unit_price: invoiceDetail.unit_price,
            code: invoiceDetail.code,
            subtotal: invoiceDetail.subtotal,
          });
        } catch (error) {
          console.log(error);
          handleHttpError(res, 'Error al crear detalles de factura');
        }
      },
    );
    await Promise.all(createInvoicesDetailsPromises);
    const balance = await balances.updateBalancebyInvoice(
      user_id,
      total * -1,
      createInvoice.id,
    );
    req.session.balance = balance;

    if (status === invoicesStatus.paid) {
      const transaction = await models.transactionsModel.create({
        amount: total,
        status_id: paymentStatus.completed.id,
        payment_method_id,
        parent_user_id: user_id,
        client_id: id,
        date,
        description: 'Pago realizado inmediatamente al crear factura',
      });
      await createInvoice.addTransaction(transaction);
    } else if (invoicesStatus.pending) {
      const clientBalance = await balances.getBalanceOfClient(id, business_id);
      await balances.createBalanceUpdate(
        clientBalance,
        total * -1,
        createInvoice.id,
      );
      await balances.updateBalance(clientBalance, total * -1);
    }

    await createActivityLog(req, 'invoice-create', createInvoice.id);
    resOkData(res, {
      createInvoice,
      invoice_details,
      newUserBalance: balance,
    });
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al crear factura');
  }
};

const getInvoicesByClientCtrl = async (req, res) => {
  const { id } = matchedData(req);
  const user_id = req.session.user.id;
  try {
    const result = await invoices.findInvoicesofUserByClient(id, user_id);
    if (!result) {
      handleHttpError(res, 'Error al obtener facturas');
      return;
    }
    resOkData(res, result);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al obtener facturas');
  }
};
const getInvoicesByTokenCtrl = async (req, res) => {
  const { token, pin: pinData } = matchedData(req);
  try {
    const clientData = await models.clientsModel.scope('withPin').findOne({
      where: { token },
      attributes: ['id', 'parent_user_id', 'pin'],
    });
    const { id, pin, parent_user_id } = clientData.dataValues;
    if (pin !== pinData) {
      handleHttpError(res, 'Invalid PIN');
      return;
    }
    const result = await invoices.findInvoicesofUserByToken(id, parent_user_id);
    console.log('facturas Dashboard', result);
    if (!result) {
      handleHttpError(res, 'Error al obtener facturas');
      return;
    }
    resOkData(res, result);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al obtener facturas');
  }
};
const getTransactionsDashboardCtrl = async (req, res) => {
  const { token, pin: pinData, invoice_id } = matchedData(req);
  try {
    const clientData = await models.clientsModel.scope('withPin').findOne({
      where: { token },
      attributes: ['pin'],
    });
    const { pin } = clientData.dataValues;
    if (pin !== pinData) {
      handleHttpError(res, 'Invalid PIN');
      return;
    }
    const result = await invoices.findInvoicebyIDforTransactions(invoice_id);
    if (!result) {
      handleHttpError(res, 'Error al obtener trasacciones');
      return;
    }
    resOkData(res, result);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al obtener transacciones');
  }
};
const getDetailsDashboardCtrl = async (req, res) => {
  const { token, pin: pinData, invoice_id } = matchedData(req);
  try {
    const clientData = await models.clientsModel.scope('withPin').findOne({
      where: { token },
      attributes: ['pin'],
    });
    const { pin } = clientData.dataValues;
    if (pin !== pinData) {
      handleHttpError(res, 'Invalid PIN');
      return;
    }
    const result = await invoices.findInvoicebyIDforDetails(invoice_id);
    if (!result) {
      handleHttpError(res, 'Error al obtener trasacciones');
      return;
    }
    resOkData(res, result);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al obtener transacciones');
  }
};
const deleteInvoicesByClientCtrl = async (req, res) => {
  const { id } = matchedData(req);
  const user_id = req.session.user.id;
  try {
    const result = await models.invoicesModel.findOne({
      where: { id },
    });

    if (!result.parent_user_id === user_id) {
      handleHttpError(res, 'La Factura no le pertenece al usuario');
      return;
    }
    if (result.status !== invoicesStatus.pending) {
      handleHttpError(res, 'La Factura no se puede eliminar');
      return;
    }
    if (result.date !== dateNow()) {
      handleHttpError(
        res,
        'Solo se puede eliminar si la factura es del dia de hoy',
      );
      return;
    }
    const clientBalance = await balances.getBalanceOfClient(
      result.client_id,
      result.business_id,
    );
    await balances.createBalanceUpdate(
      clientBalance,
      result.total_amount,
      result.id,
    );
    await balances.updateBalance(clientBalance, result.total_amount);
    await result.update({ status: invoicesStatus.cancelled });
    await createActivityLog(req, 'invoice-delete', result.id);
    resOkData(res, { status: invoicesStatus.cancelled });
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al obtener facturas');
  }
};

const addTransactionCtrl = async (req, res) => {
  const data = matchedData(req);
  const { id, ...transactionData } = data;
  try {
    const invoice = await invoices.findInvoice(data.invoice_id);
    if (!invoice) {
      handleHttpError(res, 'Error al obtener factura');
      return;
    }
    const balanceInvoice =
      invoice.total_amount -
      invoice.transactions.reduce(
        (acc, transaction) => acc + parseFloat(transaction.amount),
        0,
      );
    if (balanceInvoice <= 0) {
      handleHttpError(res, 'La factura ya ha sido pagada');
      return;
    }
    if (data.amount > balanceInvoice) {
      handleHttpError(res, 'El monto de la transaccion es mayor al saldo');
      return;
    }
    const clientBalance = await balances.getBalanceOfClient(
      data.client_id,
      invoice.users_business.id,
    );
    const transaction = await models.transactionsModel.create(transactionData);

    if (!transaction) {
      handleHttpError(res, 'Error al crear transaccion');
      return;
    }
    await invoice.addTransaction(transaction);
    await balances.createBalanceUpdate(clientBalance, data.amount, invoice.id);
    await balances.updateBalance(clientBalance, data.amount);

    if (balanceInvoice === data.amount && transaction) {
      await invoice.update({ status: invoicesStatus.paid });
    } else if (balanceInvoice > data.amount && transaction) {
      await invoice.update({ status: invoicesStatus.inProcess });
    }
    await createActivityLog(req, 'transaction-create', transaction.id);
    resOkData(res, {
      data,
    });
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error al crear transaccion');
  }
};

export {
  createInvoiceCtrl,
  getInvoicesByClientCtrl,
  addTransactionCtrl,
  deleteInvoicesByClientCtrl,
  getInvoicesByTokenCtrl,
  getTransactionsDashboardCtrl,
  getDetailsDashboardCtrl,
};
