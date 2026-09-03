import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize'
import sequelize from '../config/sequelize'
import Moment from './Moment'

export default class GeneratedImage extends Model {
    declare id: number
    declare moment_id: number|null
    declare moment_node_id: string|null
    declare purpose: string
    declare prompt: string
    declare error: string|null
    declare created_at: Date

    declare getMoment: BelongsToGetAssociationMixin<Moment>
}

GeneratedImage.init({
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
    moment_node_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    purpose: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prompt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    error: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'GeneratedImage',
    tableName: 'generated_images',
    timestamps: false,
    indexes: [
        {
            fields: ['moment_id']
        }
    ]
})

GeneratedImage.belongsTo(Moment, {
    foreignKey: 'moment_id'
})

Moment.hasMany(GeneratedImage, {
    foreignKey: 'moment_id'
})
