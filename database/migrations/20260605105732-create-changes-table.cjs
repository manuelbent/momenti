'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('changes', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            moment_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'moments',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            node_id: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            prompt: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            old_content: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            new_content: {
                type: Sequelize.JSON,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        })

        await queryInterface.addIndex('changes', ['moment_id'])
    },

    async down(queryInterface) {
        await queryInterface.dropTable('changes')
    }
}
