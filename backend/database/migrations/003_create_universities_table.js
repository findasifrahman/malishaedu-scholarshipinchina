exports.up = function(knex) {
  return knex.schema.createTable('universities', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('english_name').nullable();
    table.text('description').nullable();
    table.text('about').nullable();
    table.string('website').nullable();
    table.string('youtube_video_id').nullable();
    table.integer('city_id').unsigned().nullable();
    table.string('address').nullable();
    table.string('phone').nullable();
    table.string('email').nullable();
    table.string('logo_url').nullable();
    table.string('banner_image_url').nullable();
    table.integer('ranking').nullable();
    table.enum('type', ['public', 'private', 'international']).defaultTo('public');
    table.boolean('is_featured').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    table.foreign('city_id').references('id').inTable('cities').onDelete('SET NULL');
    table.index(['name']);
    table.index(['city_id']);
    table.index(['is_featured']);
    table.index(['is_active']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('universities');
};
