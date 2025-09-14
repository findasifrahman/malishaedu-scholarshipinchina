const db = require('../database/connection');

class ProgramName {
  static async getAll() {
    return await db('program_names')
      .select('*')
      .orderBy('name', 'asc');
  }

  static async findById(id) {
    const programName = await db('program_names')
      .select('*')
      .where('id', id)
      .first();
    return programName;
  }

  static async create(data) {
    const [programName] = await db('program_names')
      .insert(data)
      .returning('*');
    return programName;
  }

  static async update(id, data) {
    const [programName] = await db('program_names')
      .where('id', id)
      .update(data)
      .returning('*');
    return programName;
  }

  static async delete(id) {
    return await db('program_names')
      .where('id', id)
      .del();
  }

  static async findByName(name) {
    return await db('program_names')
      .select('*')
      .where('name', name)
      .first();
  }
}

module.exports = ProgramName;
