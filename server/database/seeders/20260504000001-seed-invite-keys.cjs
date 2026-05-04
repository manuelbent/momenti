'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('invite_keys', [
            {
                user_id: 1,
                key: 'QJXWZPAMTRLC',
                used_at: null,
                created_at: new Date(),
            }
        ])
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('invite_keys', { key: 'QJXWZPAMTRLC' })
    }
}
