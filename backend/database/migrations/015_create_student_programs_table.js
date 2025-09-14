exports.up = function(knex) {
  return knex.schema.createTable('student_programs', table => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('program_id').unsigned().notNullable();
    table.timestamps(true, true);
    
    // Foreign key constraints
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('program_id').references('id').inTable('programs').onDelete('CASCADE');
    
    // Unique constraint to prevent duplicate applications
    table.unique(['user_id', 'program_id']);
    
    // Indexes for better performance
    table.index('user_id');
    table.index('program_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('student_programs');
};
