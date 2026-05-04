'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('users', [
            {
                name: 'User',
                email: 'user@example.com',
                created_at: new Date(),
            }
        ])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', { email: 'user@example.com' })
    }
}

