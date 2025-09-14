exports.up = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    // Add the new city column as string
    table.string('city').nullable();
    // Add index for city
    table.index(['city']);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.dropIndex(['city']);
    table.dropColumn('city');
    table.integer('city_id').nullable();
  });
};
