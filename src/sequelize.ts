import { Sequelize } from 'sequelize-typescript';
import { logger } from "./log";

logger.debug('Postgres connection URI', process.env.DATABASE_URL);
export const sequelize = new Sequelize(process.env.DATABASE_URL);