'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ai_costs', {
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
            correlation_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            operation: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            model: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            response_id: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            input_tokens: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            output_tokens: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            cost_usd: {
                type: Sequelize.DECIMAL,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        })

        await queryInterface.addIndex('ai_costs', ['moment_id'])
        await queryInterface.addIndex('ai_costs', ['correlation_id'])
    },

    async down(queryInterface) {
        await queryInterface.dropTable('ai_costs')
    }
}
