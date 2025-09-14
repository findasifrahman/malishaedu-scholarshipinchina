exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('phone').nullable();
    table.date('date_of_birth').nullable();
    table.string('nationality').nullable();
    table.string('passport_number').nullable();
    table.string('profile_image_url').nullable();
    table.string('passport_image_url').nullable();
    table.enum('role', ['student', 'admin']).defaultTo('student');
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('email_verified_at').nullable();
    table.timestamp('last_login_at').nullable();
    table.timestamps(true, true);
    
    table.index(['email']);
    table.index(['role']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
