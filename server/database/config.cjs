module.exports = {
    test: {
        dialect: 'sqlite',
        storage: ':memory:',
    },
    dev: {
        dialect: 'sqlite',
        storage: './data/db.sqlite',
    },
    prod: {
        dialect: 'sqlite',
        storage: './data/db.sqlite',
    },
}
