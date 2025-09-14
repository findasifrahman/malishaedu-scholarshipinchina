exports.up = function(knex) {
  return knex.schema.alterTable('programs', function(table) {
    // Remove living_cost field
    table.dropColumn('living_cost');
    
    // Add new cost-related fields
    table.string('accommodation_cost_unit', 20).defaultTo('year').comment('Unit for accommodation cost: day/month/semester/year');
    table.integer('no_of_semesters_per_year').defaultTo(2).comment('Number of semesters per year');
    table.string('tuition_fee_unit', 20).defaultTo('year').comment('Unit for tuition fee: semester/year');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('programs', function(table) {
    // Restore living_cost field
    table.decimal('living_cost', 10, 2).defaultTo(0).comment('Living cost in CNY');
    
    // Remove new fields
    table.dropColumn('accommodation_cost_unit');
    table.dropColumn('no_of_semesters_per_year');
    table.dropColumn('tuition_fee_unit');
  });
};
