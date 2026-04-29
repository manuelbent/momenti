import { Model, DataTypes } from 'sequelize'
import sequelize from '../../database/sequelize'

export default class User extends Model {
    declare id: number
    declare api_key: string
    declare name: string
    declare email: string
    declare created_at: Date
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    api_key: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
    indexes: [
        {
            fields: ['api_key'],
        }
    ]
})
