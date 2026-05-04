import { Model, Identifier, ModelStatic, CreationAttributes } from 'sequelize'
import RepositoryInterface from '../interfaces/RepositoryInterface'

/**
 * Base repository class that implements common CRUD operations for Sequelize models.
 * @template T - The type of the model.
 */
export default class BaseRepository<T extends Model> implements RepositoryInterface<T> {
    model: ModelStatic<T>

    /**
     * Constructor for the BaseRepository class.
     * @param {ModelStatic<T>} model - The Sequelize model to operate on.
     */
    constructor(model: ModelStatic<T>) {
        this.model = model
    }

    /**
     * Base method to create a new record in the database.
     * @param {CreationAttributes<T>} data
     * @return {Promise<T>}
     */
    async create(data: CreationAttributes<T>): Promise<T> {
        return this.model.create(data)
    }

    /**
     * Base method to update an existing record in the database.
     * @param {Identifier} id - The identifier of the record to update.
     * @param {CreationAttributes<T>} data - The data to update the record with.
     * @return {Promise<void>}
     */
    async update(id: Identifier, data: CreationAttributes<T>): Promise<void> {
        await this.model.update(data, { where: { id: id as any } })
    }

    /**
     * Base method to delete a record from the database.
     * @param {Identifier} id
     * @return {Promise<void>}
     */
    async delete(id: Identifier): Promise<void> {
        await this.model.destroy({ where: { id: id as any } })
    }

    /**
     * Base method to find a record by its identifier.
     * @param {Identifier} id
     * @return {Promise<T | null>}
     */
    async findById(id: Identifier): Promise<T|null> {
        return this.model.findByPk(id)
    }

    /**
     * Base method to find a record by a specific field value.
     * @param {string} field - The field name to search by.
     * @param {unknown} value - The value to search for.
     * @return {Promise<T | null>}
     */
    async findBy(field: string, value: unknown): Promise<T|null> {
        return this.model.findOne({ where: { [field]: value } as any })
    }

    /**
     * Base method to find all records matching a specific field value.
     * @param {string} field - The field name to search by.
     * @param {unknown} value - The value to search for.
     * @return {Promise<T[]>}
     */
    async findManyBy(field: string, value: unknown): Promise<T[]> {
        return this.model.findAll({ where: { [field]: value } as any })
    }
}
