import logger from '../utils/logger';
import { ConnectionOptions, createConnection } from 'typeorm';
import env from './env';
import Dna from '../schemas/Dna';

export const connectionOptions = {
  name: 'default',
  type: 'mongodb',
  url: env.DB_URL,
  database: 'perfectflight',
  entities: [Dna],
  useUnifiedTopology: true,
  synchronize: true,
  writeConcern: 'majority',
  logging: false,
  useNewUrlParser: true
} as ConnectionOptions;

createConnection(connectionOptions)
  .then(() => {
    logger.info('[Database] connection established ');
  })
  .catch(() => {
    logger.error('[Database] connection failed ');
  });
