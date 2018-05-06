import { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize({
    database: 'counting',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage: 'database.sqlite'
});