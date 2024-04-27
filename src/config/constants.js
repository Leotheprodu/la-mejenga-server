/* ----------------------------------Basic constants----------------------------------- */
export const appName = 'Yehu';
export const BusinessConfigInfo = {
  userId: 9,
  businessId: 1,
};
/* ----------------------------------Business logic constants----------------------------------- */
/**
 * @description Initial balance for new users
 *  */
export const initialBalance = process.env.INITIAL_BALANCE;
/**
 * @description Billing price.
 * 3% of the invoice amount
 *  */
export const billingPrice = 0.035;

/* ------------------------------------ Email -------------------------------------------- */
export const emailPort = 587;
export const emailSecure = false;
export const emailHost = process.env.EMAIL_HOST;
export const emailUser = process.env.EMAIL_USER;
export const emailPass = process.env.EMAIL_PASS;

/* ------------------------------------ Database --------------------------------------------------*/
export const user = process.env.DB_USER;
export const password = process.env.DB_PASSWORD;
export const database = process.env.DB_NAME;
export const host = process.env.DB_HOST;
export const port = process.env.DB_PORT;

/* ------------------------------------ Config --------------------------------------------------*/
export const PORT = process.env.PORT || 5000;
export const ORIGIN_CORS = process.env.URL_CORS.split(',');
export const secret = process.env.SECRET_EXPRESS_SESSION;
export const environment = process.env.NODE_ENV;
export const FrontendDomain = process.env.FRONTEND_DOMAIN;

/* ------------------------------------ FrontendLinks --------------------------------------------------*/

export const verifyEmailLink = `${FrontendDomain}sesion/verificar-email/`;

/* ------------------------------------ Dictionaries --------------------------------------------------*/
export const typeOfRoles = {
  admin: {
    id: 1,
    name: 'admin',
  },
  verified: {
    id: 2,
    name: 'verified',
  },
  unverified: {
    id: 3,
    name: 'unverified',
  },
  vip: {
    id: 4,
    name: 'vip',
  },
};
export const invoicesStatus = {
  paid: 'paid',
  pending: 'pending',
  cancelled: 'cancelled',
  inReview: 'inReview',
  inProcess: 'inProcess',
};
export const paymentStatus = {
  completed: { id: 2, name: 'completed' },
  pending: { id: 1, name: 'pending' },
  cancelled: { id: 3, name: 'cancelled' },
};
export const paymentMethod = {
  cash: {
    id: 1,
    name: 'Efectivo',
  },
  sinpeMovil: {
    id: 2,
    name: 'Sinpe Movil',
  },
  bankTransfer: {
    id: 3,
    name: 'Deposito Bancario',
  },
  paypal: {
    id: 4,
    name: 'Paypal',
  },
  creditCard: {
    id: 5,
    name: 'Tarjeta de Credito',
  },
};
