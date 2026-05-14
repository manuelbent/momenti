import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { Sequelize } from 'sequelize'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, './../../../database/data/db.sqlite'),
    logging: false,
})

export default sequelize
