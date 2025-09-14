exports.up = function(knex) {
  return knex.schema.createTable('cities', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('province').notNullable();
    table.text('description').nullable();
    table.string('image_url').nullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    table.index(['name']);
    table.index(['province']);
    table.index(['is_active']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cities');
};
