/**
 * This interface defines the basic operations for a repository.
 * It is currently implemented by the BaseRepository, which is used as a base class for all repositories.
 * @interface RepositoryInterface
 */
export default interface RepositoryInterface<T> {
    create(data: object): Promise<T>

    update(id: string|number|any, data: object): Promise<void>

    delete(id: string|number): Promise<void>

    findById(id: string|number): Promise<T|null>
}
