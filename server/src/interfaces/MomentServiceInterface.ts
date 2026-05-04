import Moment from '../models/Moment'

/**
 * @interface MomentServiceInterface
 */
export default interface MomentServiceInterface {
    store(data: Partial<Moment>): Promise<Moment>
    update(id: number, data: Partial<Moment>): Promise<Moment>
    getAll(): Promise<Moment[]>
    slugExists(slug: string, excludeId?: number): Promise<boolean>
    generateStream(prompt: string): AsyncGenerator<{
        chunk?: string;
        done?: boolean;
        moment?: Moment;
        error?: string
    }>
}

