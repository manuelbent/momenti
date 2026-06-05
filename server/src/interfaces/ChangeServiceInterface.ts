import Change from '../models/Change'

/**
 * @interface ChangeServiceInterface
 */
export default interface ChangeServiceInterface {
    store(data: Partial<Change>): Promise<Change>
    getAll(momentId: number): Promise<Change[]>
}
