import path from 'node:path'
import sqlite3 from 'sqlite3'
import type { Store, Options, ClientRateLimitInfo } from 'express-rate-limit'

interface RateLimitRow {
    hits: number
    reset_at: number
}

/**
 * A cross-process SQLite-backed store for express-rate-limit.
 * Uses WAL (Write-Ahead Logging) mode for concurrent worker support.
 * @class SqliteRateLimitStore
 */
export default class SqliteRateLimitStore implements Store {
    /**
     * @private {sqlite3.Database}
     */
    private readonly db: sqlite3.Database

    /**
     * @private {string}
     */
    private readonly dbPath: string

    /**
     * @private {number}
     */
    private windowMs: number = 60_000

    /**
     * @private {Promise<void> | null}
     */
    private initPromise: Promise<void> | null = null

    /**
     * @param {string} dbPath
     * @constructor
     */
    constructor(dbPath: string = path.resolve(__dirname, '../../../../database/data/db.sqlite')) {
        this.dbPath = dbPath
        this.db = new sqlite3.Database(dbPath)
    }

    /**
     * Internal helper to execute a query without returning rows.
     * @param {string} sql
     * @param {unknown[]} params
     * @return {Promise<void>}
     */
    private async execute(sql: string, params: unknown[] = []): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, (err) => (err ? reject(err) : resolve()))
        })
    }

    /**
     * Internal helper to execute a query and return a single row.
     * @param {string} sql
     * @param {unknown[]} params
     * @return {Promise<T|undefined>}
     */
    private async queryRow<T>(sql: string, params: unknown[] = []): Promise<T|undefined> {
        return new Promise((resolve, reject) => {
            this.db.get<T>(sql, params, (err, row) => (err ? reject(err) : resolve(row)))
        })
    }

    /**
     * @param {Options} options
     * @return {Promise<void>}
     */
    async init(options: Options): Promise<void> {
        this.windowMs = options.windowMs
        this.initPromise = this.setup()
        await this.initPromise
    }

    /**
     * @return {Promise<void>}
     * @private
     */
    private async setup(): Promise<void> {
        // WAL requires a file, skip when memory
        if (this.dbPath !== ':memory:') {
            await this.execute('PRAGMA journal_mode=WAL')
        }

        await this.execute(`
            CREATE TABLE IF NOT EXISTS rate_limit_hits (
               key       TEXT    PRIMARY KEY,
               hits      INTEGER NOT NULL,
               reset_at  INTEGER NOT NULL
            )
        `)

        // Optional: Clean up dead keys left over from a previous server run
        await this.execute('DELETE FROM rate_limit_hits WHERE reset_at <= ?', [Date.now()])
    }

    /**
     * Internal helper to guarantee the schema is ready before writing/reading queries.
     * @return {Promise<void>}
     * @private
     */
    private async ensureReady(): Promise<void> {
        if (this.initPromise) {
            await this.initPromise
        }
    }

    /**
     * @param {string} key
     * @return {Promise<ClientRateLimitInfo>}
     */
    async increment(key: string): Promise<ClientRateLimitInfo> {
        await this.ensureReady()

        const now = Date.now()
        const resetAt = now + this.windowMs

        const sql = `
            INSERT INTO rate_limit_hits (key, hits, reset_at)
            VALUES (?, 1, ?) ON CONFLICT(key) DO
            UPDATE SET
                hits = CASE WHEN reset_at <= ? THEN 1 ELSE hits + 1 END,
                reset_at = CASE WHEN reset_at <= ? THEN excluded.reset_at ELSE reset_at
            END
            RETURNING hits, reset_at
        `

        const row = await this.queryRow<RateLimitRow>(sql, [key, resetAt, now, now])

        if (!row) {
            throw new Error(`Failed to increment rate limit for key: ${key}`)
        }

        return {
            totalHits: row.hits,
            resetTime: new Date(row.reset_at),
        }
    }

    /**
     * @param {string} key
     * @return {Promise<void>}
     */
    async decrement(key: string): Promise<void> {
        await this.ensureReady()

        await this.execute(
            'UPDATE rate_limit_hits SET hits = MAX(0, hits - 1) WHERE key = ?',
            [key]
        )
    }

    /**
     * @param {string} key
     * @return {Promise<void>}
     */
    async resetKey(key: string): Promise<void> {
        await this.ensureReady()

        await this.execute('DELETE FROM rate_limit_hits WHERE key = ?', [key])
    }
}