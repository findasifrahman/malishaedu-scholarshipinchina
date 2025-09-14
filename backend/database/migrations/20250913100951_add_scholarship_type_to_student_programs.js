/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('student_programs', function(table) {
    table.string('scholarship_type').defaultTo('none').comment('Scholarship type: none, partial, full, 50_percent');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('student_programs', function(table) {
    table.dropColumn('scholarship_type');
  });
};
