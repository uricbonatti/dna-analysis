import path from 'path';
import { ConnectionOptions, createConnection } from 'typeorm';
import env from './env';

export function genPath() {
  let baseUrl = 'src';
  let extension = '*.ts';
  if (env.NODE_ENV === 'production') {
    baseUrl = 'dist';
    extension = '*.js';
  }
  return path.resolve(baseUrl, 'schemas', extension);
}

const entitiesPath = genPath();

export const connectionOptions = {
  type: 'mongodb',
  url: env.DB_URL,
  database: 'perfectflight',
  entities: [entitiesPath],
  useUnifiedTopology: true,
  synchronize: true,
  writeConcern: 'majority',
  logging: false,
  useNewUrlParser: true
} as ConnectionOptions;

createConnection(connectionOptions);
