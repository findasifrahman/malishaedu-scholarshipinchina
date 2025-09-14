exports.up = function(knex) {
  return knex.schema.alterTable('programs', function(table) {
    // Change IELTS score to decimal to support scores like 6.5
    table.decimal('min_ielts_score', 3, 1).nullable().alter();
    
    // Change TOEFL score to decimal to support scores like 90.5 (though rare)
    table.decimal('min_toefl_score', 4, 1).nullable().alter();
    
    // HSK level can stay as integer since it's always whole numbers (1-6)
    // But let's keep it consistent with the validation schema
    table.integer('min_hsk_level').nullable().alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('programs', function(table) {
    table.integer('min_ielts_score').nullable().alter();
    table.integer('min_toefl_score').nullable().alter();
    table.integer('min_hsk_level').nullable().alter();
  });
};
