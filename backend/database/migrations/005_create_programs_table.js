exports.up = function(knex) {
  return knex.schema.createTable('programs', function(table) {
    table.increments('id').primary();
    table.integer('university_id').unsigned().notNullable();
    table.string('name').notNullable();
    table.string('english_name').nullable();
    table.text('description').nullable();
    table.enum('degree_level', ['bachelor', 'master', 'phd', 'language', 'preparatory']).notNullable();
    table.enum('language', ['chinese', 'english', 'bilingual']).notNullable();
    table.integer('duration_years').nullable();
    table.integer('duration_months').nullable();
    table.decimal('tuition_fee', 10, 2).nullable();
    table.decimal('accommodation_fee', 10, 2).nullable();
    table.decimal('living_cost', 10, 2).nullable();
    table.decimal('scholarship_amount', 10, 2).nullable();
    table.enum('scholarship_type', ['full', 'partial', 'none']).defaultTo('none');
    table.text('scholarship_description').nullable();
    table.date('application_deadline').nullable();
    table.date('intake_date').nullable();
    table.enum('intake_season', ['spring', 'autumn', 'summer', 'winter']).nullable();
    table.boolean('accepts_minors').defaultTo(false);
    table.integer('min_age').nullable();
    table.integer('max_age').nullable();
    table.decimal('min_gpa', 3, 2).nullable();
    table.decimal('min_ielts_score', 3, 1).nullable();
    table.decimal('min_toefl_score', 4, 1).nullable();
    table.integer('min_hsk_level').nullable();
    table.text('additional_requirements').nullable();
    table.boolean('is_featured').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    table.foreign('university_id').references('id').inTable('universities').onDelete('CASCADE');
    table.index(['university_id']);
    table.index(['degree_level']);
    table.index(['language']);
    table.index(['scholarship_type']);
    table.index(['intake_season']);
    table.index(['is_featured']);
    table.index(['is_active']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('programs');
};
