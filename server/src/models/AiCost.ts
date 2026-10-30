import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize'
import sequelize from '../config/sequelize'
import Moment from './Moment'

export default class AiCost extends Model {
    declare id: number
    declare moment_id: number
    declare operation: string
    declare model: string
    declare response_id: string|null
    declare input_tokens: number
    declare output_tokens: number
    declare cost_usd: number
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
        allowNull: false,
        references: {
            model: 'moments',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
        allowNull: false
    },
    output_tokens: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cost_usd: {
        type: DataTypes.DECIMAL,
        allowNull: false
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
        }
    ]
})

AiCost.belongsTo(Moment, {
    foreignKey: 'moment_id'
})

Moment.hasMany(AiCost, {
    foreignKey: 'moment_id'
})
