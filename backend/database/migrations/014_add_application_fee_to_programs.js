exports.up = function(knex) {
  return knex.schema.alterTable('programs', function(table) {
    table.decimal('application_fee', 10, 2).defaultTo(0).comment('Application fee in CNY');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('programs', function(table) {
    table.dropColumn('application_fee');
  });
};
