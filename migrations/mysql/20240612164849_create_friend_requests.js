/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    return knex.schema.createTable('friend_requests', (table) => {
        table.increments('id').primary();
        table.integer('requester_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.integer('receiver_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.enu('status', ['pending', 'accepted', 'rejected']).defaultTo('pending');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.unique(['requester_id', 'receiver_id']);
    });
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = async (knex) => {
    return knex.schema.dropTable('friend_requests');
};
