exports.up = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.string('username').unique().nullable();
    table.string('email_verification_code').nullable();
    table.timestamp('email_verification_expires_at').nullable();
    
    table.index(['username']);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.dropIndex(['username']);
    table.dropColumn('username');
    table.dropColumn('email_verification_code');
    table.dropColumn('email_verification_expires_at');
  });
};
