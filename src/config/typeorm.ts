import { DataSource, DataSourceOptions } from 'typeorm';
import env from './env';
import Dna from '../schemas/Dna';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mongodb',
  url: env.DB_URL,
  database: 'perfectflight',
  entities: [Dna],
  synchronize: true,
  writeConcern: { w: 'majority' },
  logging: false
};

export const dataSource = new DataSource(dataSourceOptions);
