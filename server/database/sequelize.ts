import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/data/db.sqlite',
    logging: false,
})

export default sequelize
