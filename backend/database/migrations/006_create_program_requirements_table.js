exports.up = function(knex) {
  return knex.schema.createTable('program_requirements', function(table) {
    table.increments('id').primary();
    table.integer('program_id').unsigned().notNullable();
    table.string('requirement_type').notNullable(); // 'academic', 'language', 'document', 'other'
    table.string('title').notNullable();
    table.text('description').nullable();
    table.boolean('is_required').defaultTo(true);
    table.integer('sort_order').defaultTo(0);
    table.timestamps(true, true);
    
    table.foreign('program_id').references('id').inTable('programs').onDelete('CASCADE');
    table.index(['program_id']);
    table.index(['requirement_type']);
    table.index(['sort_order']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('program_requirements');
};
