exports.up = function(knex) {
  return knex.schema.createTable('university_images', function(table) {
    table.increments('id').primary();
    table.integer('university_id').unsigned().notNullable();
    table.string('image_url').notNullable();
    table.string('alt_text').nullable();
    table.integer('sort_order').defaultTo(0);
    table.boolean('is_featured').defaultTo(false);
    table.timestamps(true, true);
    
    table.foreign('university_id').references('id').inTable('universities').onDelete('CASCADE');
    table.index(['university_id']);
    table.index(['sort_order']);
    table.index(['is_featured']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('university_images');
};
