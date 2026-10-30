import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize'
import sequelize from '../config/sequelize'
import Moment from './Moment'
import User from './User'

export default class AiCost extends Model {
    declare id: number
    declare moment_id: number|null
    declare user_id: number
    declare generation_id: string|null
    declare operation: string
    declare model: string
    declare response_id: string|null
    declare input_tokens: number|null
    declare output_tokens: number|null
    declare cost_usd: number|null
    declare created_at: Date

    declare getMoment: BelongsToGetAssociationMixin<Moment>
    declare getUser: BelongsToGetAssociationMixin<User>
}

AiCost.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    moment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'moments',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    generation_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    operation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    response_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    input_tokens: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    output_tokens: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    cost_usd: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'AiCost',
    tableName: 'ai_costs',
    timestamps: false,
    indexes: [
        {
            fields: ['moment_id']
        },
        {
            fields: ['user_id']
        },
        {
            fields: ['generation_id']
        }
    ]
})

AiCost.belongsTo(Moment, {
    foreignKey: 'moment_id'
})

Moment.hasMany(AiCost, {
    foreignKey: 'moment_id'
})

AiCost.belongsTo(User, {
    foreignKey: 'user_id'
})

User.hasMany(AiCost, {
    foreignKey: 'user_id'
})
