import MomentRepositoryInterface from '../interfaces/MomentRepositoryInterface'
import BaseRepository from './BaseRepository'
import Moment from '../models/Moment'

export default class MomentRepository extends BaseRepository<Moment> implements MomentRepositoryInterface {
    constructor() { super(Moment) }
}
