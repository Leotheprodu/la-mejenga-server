import session from 'express-session';
import mysql from 'mysql2/promise';
import credentials from './credentials.js';
import { secret, environment } from './constants.js';

const connection = mysql.createPool(credentials);

// Importa el módulo de forma dinámica utilizando una función import()
const expressMySQLSession = await import('express-mysql-session');
const MySQLStore = expressMySQLSession.default(session);

const sessionStore = new MySQLStore({}, connection);

const sess = {
  key: 'sessionId',
  secret,
  store: sessionStore,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000,
    secure: environment === 'production',
    sameSite: environment === 'production' ? 'none' : false,
  },
};

export default sess;
