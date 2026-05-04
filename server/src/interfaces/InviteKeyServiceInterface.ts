/**
 * @interface InviteKeyServiceInterface
 */
export default interface InviteKeyServiceInterface {
    validate(key: string): Promise<boolean>
}
