import { DataSourceOptions } from 'typeorm';
import { join } from 'path';

export const getDatabaseConfig = (): DataSourceOptions => {
  const isTest = process.env['NODE_ENV'] === 'test';

  return {
    type: 'better-sqlite3',
    database: isTest
      ? ':memory:'
      : join(process.cwd(), 'data', 'recipe-api.db'),
    entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
    migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
    synchronize: false,
    logging: process.env['DB_LOGGING'] === 'true',
  };
};
