exports.up = function(knex) {
  return knex.schema.alterTable('programs', function(table) {
    // Program ID (required) - this might already exist as 'id', but let's add program_id if needed
    table.string('program_id').nullable().comment('Unique program identifier');
    
    // Scholarship category (optional)
    table.string('scholarship_category').nullable().comment('Category of scholarship');
    
    // Tuition fee provide type (dropdown: semester/year)
    table.string('tuition_fee_type').nullable().comment('Tuition fee calculation period');
    
    // Service fee (number, required)
    table.decimal('service_fee', 10, 2).nullable().defaultTo(0).comment('Service fee amount');
    
    // Teaching language (chinese or english, required)
    table.string('teaching_language').nullable().comment('Primary teaching language');
    
    // Program field (required)
    table.string('program_field').nullable().comment('Field of study/program area');
    
    // Scholarship duration (floating point, optional)
    table.decimal('scholarship_duration', 5, 2).nullable().comment('Scholarship duration in years');
    
    // Scholarship policy (text, optional)
    table.text('scholarship_policy').nullable().comment('Scholarship policy details');
    
    // Accept students who come to China (boolean, required)
    table.boolean('accept_students_who_come_to_china').nullable().defaultTo(true).comment('Accepts students coming to China');
    
    // Acceptable student's current location (text, optional)
    table.text('acceptable_student_location').nullable().comment('Acceptable student current locations');
    
    // Application documents (comma separated big text, required)
    table.text('application_documents').nullable().comment('Required application documents');
    
    // Special notes (text, optional)
    table.text('special_notes').nullable().comment('Special notes about the program');
  }).then(() => {
    // Update existing records with default values
    return knex('programs').update({
      program_id: knex.raw('CONCAT(\'PROG-\', id)'),
      service_fee: 0,
      teaching_language: 'english',
      program_field: 'General Studies',
      accept_students_who_come_to_china: true,
      application_documents: 'Application form, Academic transcripts, Language proficiency certificate, Passport copy'
    });
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('programs', function(table) {
    table.dropColumn('program_id');
    table.dropColumn('scholarship_category');
    table.dropColumn('tuition_fee_type');
    table.dropColumn('service_fee');
    table.dropColumn('teaching_language');
    table.dropColumn('program_field');
    table.dropColumn('scholarship_duration');
    table.dropColumn('scholarship_policy');
    table.dropColumn('accept_students_who_come_to_china');
    table.dropColumn('acceptable_student_location');
    table.dropColumn('application_documents');
    table.dropColumn('special_notes');
  });
};
