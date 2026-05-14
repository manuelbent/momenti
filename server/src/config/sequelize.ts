import path from 'node:path'
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, './../../../database/data/db.sqlite'),
    logging: false,
})

export default sequelize
