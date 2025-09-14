exports.up = function(knex) {
  return knex.schema.alterTable('programs', function(table) {
    table.integer('program_name_id').nullable().comment('Reference to program_names table');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('programs', function(table) {
    table.dropColumn('program_name_id');
  });
};
