/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("friends", (table) => {
        table.increments("id").primary();
        table.integer("user_id1").unsigned().notNullable();
        table.integer("user_id2").unsigned().notNullable();
        table.foreign("user_id1").references("id").inTable("users").onDelete("CASCADE");
        table.foreign("user_id2").references("id").inTable("users").onDelete("CASCADE");
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("friends");
}




