'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('images', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            url: {
                type: Sequelize.STRING,
                allowNull: false
            },
            type: {
                type: Sequelize.ENUM('uploaded', 'generated'),
                allowNull: false,
            },
            moment_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'moments',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            moment_node_id: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            purpose: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            prompt: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            error: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        })

        await queryInterface.addIndex('images', ['moment_id'])
    },

    async down(queryInterface) {
        await queryInterface.dropTable('images')
    }
}
