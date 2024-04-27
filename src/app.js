import 'dotenv/config';
import cors from 'cors';
import session from 'express-session';
import express from 'express';
import { dbConnectMySql } from './config/mysql.js';
import router from './routes/index.js';
import sess from './config/expressSessions.js';
import { PORT, ORIGIN_CORS } from './config/constants.js';

const app = express();
app.use(
  cors({
    origin: ORIGIN_CORS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Accept',
      'x-client-key',
      'x-client-token',
      'x-client-secret',
      'Authorization',
    ],
    credentials: true,
  }),
);
app.set('trust proxy', 1);
app.use(session(sess));
app.use(express.json());
app.use('/api', router);
const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The server is listening on port ${PORT}...`);
});

server.timeout = 30000;
dbConnectMySql();
