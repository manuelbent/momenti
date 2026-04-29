import { Model, DataTypes } from 'sequelize'
import sequelize from '../../database/sequelize'
import User from './User'

export default class Moment extends Model {
    declare id: number
    declare user_id: number
    declare slug: string
    declare content: object
    declare is_published: boolean
    declare created_at: Date
    declare updated_at: Date|null
}

Moment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    content: {
        type: DataTypes.JSON,
        allowNull: false
    },
    is_published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Moment',
    tableName: 'moments',
    timestamps: false
})

Moment.belongsTo(User, {
    foreignKey: 'user_id'
})

User.hasMany(Moment, {
    foreignKey: 'user_id'
})
