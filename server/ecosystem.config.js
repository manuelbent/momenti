module.exports = {
    apps: [{
        name: 'momenti-api',
        script: './dist/server.js',
        env: {
            NODE_ENV: 'production',
            OPENAI_API_KEY: 'placeholder'
        }
    }]
}
