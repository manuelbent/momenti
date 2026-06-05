import MomentRepositoryInterface from '../interfaces/MomentRepositoryInterface'
import BaseRepository from './BaseRepository'
import Moment from '../models/Moment'

export default class MomentRepository extends BaseRepository<Moment> implements MomentRepositoryInterface {
    constructor() { super(Moment) }

    async findPublishedBySlug(slug: string): Promise<Moment|null> {
        return this.model.findOne({ where: { slug, is_published: true } })
    }
}
