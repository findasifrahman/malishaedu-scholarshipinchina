exports.up = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    // Make first_name and last_name nullable
    table.string('first_name').nullable().alter();
    table.string('last_name').nullable().alter();
    
    // Add unique constraint to phone if it doesn't exist
    table.unique('phone');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    // Revert first_name and last_name to not nullable
    table.string('first_name').notNullable().alter();
    table.string('last_name').notNullable().alter();
    
    // Remove unique constraint from phone
    table.dropUnique('phone');
  });
};
