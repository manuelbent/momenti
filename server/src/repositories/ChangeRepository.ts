import ChangeRepositoryInterface from '../interfaces/ChangeRepositoryInterface'
import BaseRepository from './BaseRepository'
import Change from '../models/Change'

export default class ChangeRepository extends BaseRepository<Change> implements ChangeRepositoryInterface {
    constructor() { super(Change) }
}
