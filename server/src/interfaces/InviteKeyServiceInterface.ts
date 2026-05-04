/**
 * @interface InviteKeyServiceInterface
 */
export default interface InviteKeyServiceInterface {
    validate(invite_key: string): Promise<boolean>
}
