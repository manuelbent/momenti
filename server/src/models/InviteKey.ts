import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize'
import sequelize from '../../database/sequelize'
import User from './User'

export default class InviteKey extends Model {
    declare id: number
    declare user_id: number
    declare key: string
    declare used_at: Date|null
    declare created_at: Date

    declare getUser: BelongsToGetAssociationMixin<User>
}

InviteKey.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    key: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
    },
    used_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'InviteKey',
    tableName: 'invite_keys',
    timestamps: false,
    indexes: [
        { fields: ['key'] },
        { fields: ['user_id'] }
    ]
})

InviteKey.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(InviteKey, { foreignKey: 'user_id' })
