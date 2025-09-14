exports.up = function(knex) {
  return knex.schema.alterTable('users', table => {
    table.dropColumn('program_id');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', table => {
    table.integer('program_id').nullable();
  });
};
