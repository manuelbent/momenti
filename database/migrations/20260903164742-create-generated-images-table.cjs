'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('generated_images', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
                allowNull: false,
            },
            prompt: {
                type: Sequelize.STRING,
                allowNull: false,
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

        await queryInterface.addIndex('generated_images', ['moment_id'])
    },

    async down(queryInterface) {
        await queryInterface.dropTable('generated_images')
    }
}
