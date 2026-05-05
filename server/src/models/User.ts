import { Model, DataTypes, HasManyGetAssociationsMixin } from 'sequelize'
import sequelize from '../../database/sequelize'
import type Moment from './Moment'

export default class User extends Model {
    declare id: number
    declare name: string
    declare email: string
    declare created_at: Date

    declare getMoments: HasManyGetAssociationsMixin<Moment>
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
            fields: ['email'],
        }
    ]
})
