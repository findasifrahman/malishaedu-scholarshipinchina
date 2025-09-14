const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  // Inserts seed entries
  const password_hash = await bcrypt.hash('Asif@12345', 12);
  
  return knex('users').insert([
    {
      id: 1,
      username: 'admin',
      email: 'findasifrahman@gmail.com',
      password_hash: password_hash,
      first_name: 'Asif',
      last_name: 'Rahman',
      role: 'admin',
      is_verified: true,
      email_verified_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
};

