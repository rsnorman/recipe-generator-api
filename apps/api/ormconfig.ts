import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './src/database/database.config';

export default new DataSource(getDatabaseConfig());
