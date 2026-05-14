module.exports = {
    test: {
        dialect: 'sqlite',
        storage: ':memory:',
    },
    dev: {
        dialect: 'sqlite',
        storage: './../database/data/db.sqlite',
    },
    prod: {
        dialect: 'sqlite',
        storage: './../database/data/db.sqlite',
    },
}
