import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize'
import sequelize from '../config/sequelize'
import User from './User'

export type FeedbackType = 'bug'|'suggestion'|'other'

export default class Feedback extends Model {
    declare id: number
    declare user_id: number
    declare type: FeedbackType
    declare message: string
    declare submitted_at: Date

    declare getUser: BelongsToGetAssociationMixin<User>
}

Feedback.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('bug', 'suggestion', 'other'),
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    submitted_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'Feedback',
    tableName: 'feedbacks',
    timestamps: false,
    indexes: [
        { fields: ['user_id'] }
    ]
})

Feedback.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(Feedback, { foreignKey: 'user_id' })
