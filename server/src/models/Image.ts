import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize'
import sequelize from '../config/sequelize'
import Moment from './Moment'

export type ImageType = 'uploaded'|'generated'

export default class Image extends Model {
    declare id: number
    declare type: ImageType
    declare moment_id: number|null
    declare moment_node_id: string|null
    declare purpose: string|null
    declare prompt: string|null
    declare error: string|null
    declare created_at: Date

    declare getMoment: BelongsToGetAssociationMixin<Moment>
}

Image.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('uploaded', 'generated'),
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
        allowNull: true
    },
    prompt: {
        type: DataTypes.STRING,
        allowNull: true
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
    modelName: 'Image',
    tableName: 'images',
    timestamps: false,
    indexes: [
        {
            fields: ['moment_id']
        }
    ]
})

Image.belongsTo(Moment, {
    foreignKey: 'moment_id'
})

Moment.hasMany(Image, {
    foreignKey: 'moment_id'
})
