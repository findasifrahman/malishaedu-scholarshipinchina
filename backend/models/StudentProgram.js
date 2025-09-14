const db = require('../database/connection');

class StudentProgram {
  static async create(userId, programId, scholarshipType = 'none') {
    const [studentProgram] = await db('student_programs')
      .insert({ user_id: userId, program_id: programId, scholarship_type: scholarshipType })
      .returning('*');
    return studentProgram;
  }

  static async findByUserAndProgram(userId, programId) {
    return await db('student_programs')
      .where({ user_id: userId, program_id: programId })
      .first();
  }

  static async findByUserId(userId) {
    return await db('student_programs')
      .leftJoin('programs', 'student_programs.program_id', 'programs.id')
      .leftJoin('universities', 'programs.university_id', 'universities.id')
      .leftJoin('cities', 'universities.city_id', 'cities.id')
      .select(
        'student_programs.*',
        'programs.name as program_name',
        'programs.english_name as program_english_name',
        'programs.degree_level',
        'programs.language',
        'programs.scholarship_type',
        'programs.tuition_fee',
        'programs.application_deadline',
        'universities.name as university_name',
        'universities.logo_url as university_logo',
        'cities.name as city_name',
        'cities.province as city_province'
      )
      .where('student_programs.user_id', userId)
      .orderBy('student_programs.created_at', 'desc');
  }

  static async findByProgramId(programId) {
    return await db('student_programs')
      .leftJoin('users', 'student_programs.user_id', 'users.id')
      .select(
        'student_programs.*',
        'users.first_name',
        'users.last_name',
        'users.email',
        'users.nationality',
        'users.with_scholarship'
      )
      .where('student_programs.program_id', programId)
      .orderBy('student_programs.created_at', 'desc');
  }

  static async delete(userId, programId) {
    return await db('student_programs')
      .where({ user_id: userId, program_id: programId })
      .del();
  }

  static async deleteById(id) {
    return await db('student_programs')
      .where({ id })
      .del();
  }

  static async getApplicationStats() {
    const stats = await db('student_programs')
      .leftJoin('programs', 'student_programs.program_id', 'programs.id')
      .leftJoin('universities', 'programs.university_id', 'universities.id')
      .select(
        'programs.id as program_id',
        'programs.name as program_name',
        'universities.name as university_name',
        db.raw('COUNT(student_programs.id) as application_count')
      )
      .groupBy('programs.id', 'programs.name', 'universities.name')
      .orderBy('application_count', 'desc');

    return stats;
  }

  static async getTotalApplications() {
    const result = await db('student_programs')
      .count('* as total')
      .first();
    
    return parseInt(result.total);
  }

  static async getUniqueStudents() {
    const result = await db('student_programs')
      .countDistinct('user_id as total')
      .first();
    
    return parseInt(result.total);
  }
}

module.exports = StudentProgram;
