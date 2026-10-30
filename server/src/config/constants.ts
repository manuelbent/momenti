export const MAX_MOMENTS_ALLOWED = 5
export const MAX_CHANGES_ALLOWED = 5

export const MIN_PROMPT_LENGTH = 10
export const MAX_PROMPT_LENGTH = 1500

export const TOKEN_RATES_USD = {
    'gpt-6-luna': { input: 0.0000001, output: 0.0000005 },
    'gpt-6.1-terra': { input: 0.000001, output: 0.000005 },
    'gpt-image-2.5-flare': { input: 0.000008, output: 0.000030 },
    'omni-moderation-latest': { input: 0, output: 0 },
} as const

export const RESERVED_SUBDOMAINS = new Set([
    'api',
    'assets',
    'web',
    'www',
    'admin',
    'app',
    'mail',
    'smtp',
    'ftp',
    'cdn',
    'static',
    'status',
    'support',
    'help',
    'docs',
    'dev',
    'stag',
    'staging',
    'prod',
    'storage',
    'test',
])
