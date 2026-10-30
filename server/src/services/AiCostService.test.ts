import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryInterface, Sequelize } from 'sequelize'
import AiCostRepositoryInterface from '../interfaces/AiCostRepositoryInterface'
import AiCost from '../models/AiCost'
import AiCostService from './AiCostService'

describe('AiCostService', () => {
    let create: ReturnType<typeof vi.fn>
    let service: AiCostService

    beforeEach(() => {
        create = vi.fn()
        service = new AiCostService({ create } as unknown as AiCostRepositoryInterface)
    })

    describe('AI cost migration', () => {
        interface Migration {
            up(queryInterface: QueryInterface, sequelize: typeof Sequelize): Promise<void>
            down(queryInterface: QueryInterface, sequelize: typeof Sequelize): Promise<void>
        }

        const create: Migration = require('../../../database/migrations/20261030104542-create-ai-costs-table.cjs')

        it('matches model nullability and creates the expected fields, indexes, and foreign key', async () => {
            const db = new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false })
            const queryInterface = db.getQueryInterface()

            try {
                await queryInterface.createTable('moments', { id: { type: Sequelize.INTEGER, primaryKey: true } })
                await queryInterface.bulkInsert('moments', [{ id: 1 }])
                const createTable = vi.spyOn(queryInterface, 'createTable')
                await create.up(queryInterface, Sequelize)
                await queryInterface.bulkInsert('ai_costs', [{
                    moment_id: 1,
                    correlation_id: 'existing',
                    operation: 'moment-patch',
                    model: 'gpt-6.1-terra',
                    input_tokens: 100,
                    output_tokens: 20,
                    cost_usd: 0.0002,
                    created_at: new Date(),
                }])
                const columns = await queryInterface.describeTable('ai_costs')
                expect(Object.keys(columns).sort()).toEqual([
                    'id', 'moment_id', 'correlation_id', 'operation', 'model',
                    'response_id', 'input_tokens', 'output_tokens', 'cost_usd', 'created_at',
                ].sort())
                const definitions = createTable.mock.calls[0][1]
                for (const [column, attribute] of Object.entries(AiCost.getAttributes())) {
                    expect(definitions[column], column).toEqual(expect.objectContaining({
                        allowNull: attribute.allowNull,
                    }))
                }
                const indexes = await queryInterface.showIndex('ai_costs')
                expect(indexes).toEqual(expect.arrayContaining([
                    expect.objectContaining({ name: 'ai_costs_moment_id' }),
                    expect.objectContaining({ name: 'ai_costs_correlation_id' }),
                ]))
                const [existing] = await db.query('SELECT * FROM ai_costs')
                expect(existing).toEqual([expect.objectContaining({
                    moment_id: 1, input_tokens: 100, cost_usd: 0.0002,
                })])
                const references = await queryInterface.getForeignKeyReferencesForTable('ai_costs')
                expect(references).toEqual(expect.arrayContaining([
                    expect.objectContaining({ columnName: 'moment_id', referencedTableName: 'moments' }),
                ]))

                await queryInterface.bulkInsert('ai_costs', [{
                    correlation_id: 'unknown',
                    operation: 'hero-image-generation',
                    model: 'gpt-image-2.5-flare',
                    created_at: new Date(),
                }])
                const [unknown] = await db.query("SELECT * FROM ai_costs WHERE correlation_id = 'unknown'")
                expect(unknown).toEqual([expect.objectContaining({
                    input_tokens: null,
                    output_tokens: null,
                    cost_usd: null,
                })])
                await create.down(queryInterface, Sequelize)
                expect(await queryInterface.showAllTables()).not.toContain('ai_costs')
            } finally {
                await db.close()
            }
        })
    })

    it('calculates and persists the cost for gpt-6-luna', async () => {
        create.mockResolvedValue({})

        await service.record({
            moment_id: null,
            correlation_id: 'b98d7e8d-4c12-4a2f-95bb-94d324076d0b',
            operation: 'prompt-classification',
            model: 'gpt-6-luna',
            response_id: 'chatcmpl_123',
            input_tokens: 100,
            output_tokens: 20,
        })

        expect(create).toHaveBeenCalledWith(expect.objectContaining({
            cost_usd: 0.00002,
        }))
    })

    it('rejects models without configured rates', async () => {
        await expect(service.record({
            moment_id: null,
            correlation_id: 'b98d7e8d-4c12-4a2f-95bb-94d324076d0b',
            operation: 'unknown',
            model: 'unknown-model',
            response_id: null,
            input_tokens: 1,
            output_tokens: 1,
        })).rejects.toThrow('No token rates configured for AI model "unknown-model".')
    })

    it('prices all image-generation input tokens at the higher input rate', async () => {
        await service.record({
            model: 'gpt-image-2.5-flare',
            input_tokens: 150,
            output_tokens: 200,
        })

        expect(create).toHaveBeenCalledWith(expect.objectContaining({ cost_usd: 0.0072 }))
    })

    it('can price an explicitly zero input', async () => {
        await service.record({
            model: 'gpt-image-2.5-flare',
            input_tokens: 0,
            output_tokens: 200,
        })

        expect(create).toHaveBeenCalledWith(expect.objectContaining({
            cost_usd: 0.006,
        }))
    })

    it.each([
        'input_tokens',
        'output_tokens',
    ] as const)('stores an unknown image cost when %s is unavailable', async (missing) => {
        await service.record({
            model: 'gpt-image-2.5-flare',
            input_tokens: 150,
            output_tokens: 200,
            [missing]: null,
        })

        expect(create).toHaveBeenCalledWith(expect.objectContaining({ cost_usd: null }))
    })

    it('stores unknown text cost when usage is unavailable', async () => {
        await service.record({ model: 'gpt-6-luna', input_tokens: null, output_tokens: null })

        expect(create).toHaveBeenCalledWith(expect.objectContaining({ cost_usd: null }))
    })

    it('records free moderation even when its token counts are unavailable', async () => {
        await service.record({ model: 'omni-moderation-latest', input_tokens: null, output_tokens: null })

        expect(create).toHaveBeenCalledWith(expect.objectContaining({ cost_usd: 0 }))
    })
})
