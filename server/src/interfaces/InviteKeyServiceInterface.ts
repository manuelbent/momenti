import InviteKey from '../models/InviteKey'

/**
 * @interface InviteKeyServiceInterface
 */
export default interface InviteKeyServiceInterface {
    generate(userId: number): Promise<InviteKey>
    validate(key: string): Promise<boolean>
}
