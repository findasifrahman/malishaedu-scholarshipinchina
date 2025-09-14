exports.up = function(knex) {
  return knex.schema.alterTable('programs', function(table) {
    // Remove redundant tuition_fee_type field
    table.dropColumn('tuition_fee_type');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('programs', function(table) {
    // Restore tuition_fee_type field
    table.string('tuition_fee_type', 20).defaultTo('year').comment('Type for tuition fee: semester/year');
  });
};
