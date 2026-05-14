import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize'
import sequelize from '../config/sequelize'
import Moment from './Moment'

export default class FormSubmission extends Model {
    declare id: number
    declare moment_id: number
    declare form_id: string
    declare data: Record<string, string>
    declare submitted_at: Date

    declare getMoment: BelongsToGetAssociationMixin<Moment>
}

FormSubmission.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    moment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'moments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    form_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.JSON,
        allowNull: false
    },
    submitted_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'FormSubmission',
    tableName: 'form_submissions',
    timestamps: false
})

FormSubmission.belongsTo(Moment, { foreignKey: 'moment_id' })
Moment.hasMany(FormSubmission, { foreignKey: 'moment_id' })
