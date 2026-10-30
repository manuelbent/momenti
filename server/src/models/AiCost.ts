import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize'
import sequelize from '../config/sequelize'
import Moment from './Moment'

export default class AiCost extends Model {
    declare id: number
    declare moment_id: number|null
    declare correlation_id: string
    declare operation: string
    declare model: string
    declare response_id: string|null
    declare input_tokens: number|null
    declare output_tokens: number|null
    declare cost_usd: number|null
    declare created_at: Date

    declare getMoment: BelongsToGetAssociationMixin<Moment>
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
    correlation_id: {
        type: DataTypes.STRING,
        allowNull: false
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
            fields: ['correlation_id']
        }
    ]
})

AiCost.belongsTo(Moment, {
    foreignKey: 'moment_id'
})

Moment.hasMany(AiCost, {
    foreignKey: 'moment_id'
})
