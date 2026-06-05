import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize'
import sequelize from '../config/sequelize'
import Moment from './Moment'

export default class Change extends Model {
    declare id: number
    declare moment_id: number
    declare node_id?: string
    declare prompt: string
    declare old_content?: object // we can keep track of old content for undo functionality in the future
    declare new_content: object
    declare created_at: Date

    declare getMoment: BelongsToGetAssociationMixin<Moment>
}

Change.init({
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
    prompt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    old_content: {
        type: DataTypes.JSON,
        allowNull: true
    },
    new_content: {
        type: DataTypes.JSON,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    sequelize,
    modelName: 'Change',
    tableName: 'changes',
    timestamps: false,
    indexes: [
        {
            fields: ['slug'],
        }
    ]
})

Change.belongsTo(Moment, {
    foreignKey: 'moment_id'
})

Moment.hasMany(Change, {
    foreignKey: 'moment_id'
})
