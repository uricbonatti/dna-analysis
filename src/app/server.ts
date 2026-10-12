import 'reflect-metadata';

import { dataSource } from '../config/typeorm';
import '../config/containers';

import app from './app';
import env from '../config/env';

import logger from '../utils/logger';

dataSource
  .initialize()
  .then(() => logger.info('[Database] connection established'))
  .catch((err) => logger.error('[Database] connection failed', err));

app.listen(env.PORT, () => {
  logger.info(`[RESTARTING] Server running on port ${env.PORT}`);
});
