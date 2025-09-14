exports.up = function(knex) {
  return knex.schema.alterTable('users', table => {
    // Personal information fields (city already exists from migration 008)
    table.string('address').nullable();
    table.integer('program_id').nullable();
    table.string('with_scholarship').nullable(); // 'partial', 'full', 'none'
    
    // Document upload fields
    table.string('passport_scanned_url').nullable();
    table.string('passport_photo_url').nullable();
    table.string('academic_transcripts_url').nullable();
    table.string('highest_degree_diploma_url').nullable();
    table.string('physical_examination_form_url').nullable();
    table.string('police_clearance_url').nullable();
    table.string('chinese_language_certificate_url').nullable();
    table.string('application_form_url').nullable();
    table.string('recommendation_letter_1_url').nullable();
    table.string('recommendation_letter_2_url').nullable();
    table.string('guarantee_letter_url').nullable();
    table.string('residence_permit_url').nullable();
    table.string('study_certificate_china_url').nullable();
    table.string('others_1_url').nullable();
    table.string('others_2_url').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', table => {
    table.dropColumn('address');
    table.dropColumn('program_id');
    table.dropColumn('with_scholarship');
    table.dropColumn('passport_scanned_url');
    table.dropColumn('passport_photo_url');
    table.dropColumn('academic_transcripts_url');
    table.dropColumn('highest_degree_diploma_url');
    table.dropColumn('physical_examination_form_url');
    table.dropColumn('police_clearance_url');
    table.dropColumn('chinese_language_certificate_url');
    table.dropColumn('application_form_url');
    table.dropColumn('recommendation_letter_1_url');
    table.dropColumn('recommendation_letter_2_url');
    table.dropColumn('guarantee_letter_url');
    table.dropColumn('residence_permit_url');
    table.dropColumn('study_certificate_china_url');
    table.dropColumn('others_1_url');
    table.dropColumn('others_2_url');
  });
};
