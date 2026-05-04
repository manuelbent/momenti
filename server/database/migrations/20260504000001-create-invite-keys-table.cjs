'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('invite_keys', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            key: {
                type: Sequelize.STRING(64),
                allowNull: false,
                unique: true
            },
            used_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        })

        await queryInterface.addIndex('invite_keys', ['key'])
        await queryInterface.addIndex('invite_keys', ['user_id'])
    },

    async down(queryInterface) {
        await queryInterface.dropTable('invite_keys')
    }
}

