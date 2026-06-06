module.exports = {
    apps: [
        {
            name: 'momenti-api',
            script: './dist/server.js',
            env: {
                NODE_ENV: 'production',
                OPENAI_API_KEY: 'OPENAI_API_KEY_VALUE',
                R2_ACCOUNT_ID: 'R2_ACCOUNT_ID_VALUE',
                R2_ACCESS_KEY_ID: 'R2_ACCESS_KEY_ID_VALUE',
                R2_SECRET_ACCESS_KEY: 'R2_SECRET_ACCESS_KEY_VALUE',
                R2_PUBLIC_URL: 'R2_PUBLIC_URL_VALUE',
                R2_BUCKET_NAME: 'momenti-mvp',
                MAX_MOMENTS_ALLOWED: 30,
                REDIS_URL: 'redis://localhost:6379',
                RATE_LIMIT_VALIDATE_MAX: 10,
                RATE_LIMIT_VALIDATE_WINDOW_SEC: 60,
                ADMIN_TOKEN: 'ADMIN_TOKEN_VALUE'
            }
        }
    ]
}
