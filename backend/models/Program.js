const db = require('../database/connection');

class Program {
  static async create(programData) {
    // Check if program_id already exists
    const existingProgram = await db('programs')
      .where('program_id', programData.program_id)
      .first();
    
    if (existingProgram) {
      throw new Error('Program ID already exists. Please choose a different Program ID.');
    }
    
    const [program] = await db('programs')
      .insert(programData)
      .returning('*');
    return program;
  }

  static async findById(id) {
    const program = await db('programs')
      .leftJoin('universities', 'programs.university_id', 'universities.id')
      .leftJoin('cities', 'universities.city_id', 'cities.id')
      .select(
        'programs.*',
        'universities.name as university_name',
        'universities.english_name as university_english_name',
        'universities.logo_url as university_logo',
        'cities.name as city_name',
        'cities.province as city_province'
      )
      .where('programs.id', id)
      .first();
    
    if (program) {
      // Get program requirements
      const requirements = await db('program_requirements')
        .where('program_id', id)
        .orderBy('sort_order', 'asc');
      
      program.requirements = requirements;
    }
    
    return program;
  }

  static async getAll(filters = {}, limit = 20, offset = 0) {
    let query = db('programs')
      .leftJoin('universities', 'programs.university_id', 'universities.id')
      .leftJoin('cities', 'universities.city_id', 'cities.id')
      .select(
        'programs.*',
        'universities.name as university_name',
        'universities.english_name as university_english_name',
        'universities.logo_url as university_logo',
        'cities.name as city_name',
        'cities.province as city_province'
      )
      .where('programs.is_active', true);

    // Apply filters
    if (filters.university_id) {
      query = query.where('programs.university_id', filters.university_id);
    }
    
    if (filters.degree_level) {
      query = query.where('programs.degree_level', filters.degree_level);
    }
    
    if (filters.language) {
      query = query.where('programs.language', filters.language);
    }
    
    if (filters.scholarship_type) {
      query = query.where('programs.scholarship_type', filters.scholarship_type);
    }
    
    if (filters.intake_season) {
      query = query.where('programs.intake_season', filters.intake_season);
    }
    
    if (filters.accepts_minors !== undefined) {
      query = query.where('programs.accepts_minors', filters.accepts_minors);
    }
    
    if (filters.city_id) {
      query = query.where('universities.city_id', filters.city_id);
    }
    
    if (filters.search) {
      query = query.where(function() {
        this.where('programs.name', 'ilike', `%${filters.search}%`)
            .orWhere('programs.english_name', 'ilike', `%${filters.search}%`)
            .orWhere('universities.name', 'ilike', `%${filters.search}%`);
      });
    }

    // Filter out programs with passed application deadlines
    // Only show programs where application_deadline is null or in the future
    query = query.where(function() {
      this.whereNull('programs.application_deadline')
          .orWhere('programs.application_deadline', '>=', new Date().toISOString().split('T')[0]);
    });

    const programs = await query
      .limit(limit)
      .offset(offset)
      .orderBy('programs.is_featured', 'desc')
      .orderBy('programs.created_at', 'desc');

    // Apply the same filters for total count
    let totalQuery = db('programs')
      .leftJoin('universities', 'programs.university_id', 'universities.id')
      .where('programs.is_active', true);

    // Apply filters for total count
    if (filters.university_id) {
      totalQuery = totalQuery.where('programs.university_id', filters.university_id);
    }
    
    if (filters.degree_level) {
      totalQuery = totalQuery.where('programs.degree_level', filters.degree_level);
    }
    
    if (filters.language) {
      totalQuery = totalQuery.where('programs.language', filters.language);
    }
    
    if (filters.scholarship_type) {
      totalQuery = totalQuery.where('programs.scholarship_type', filters.scholarship_type);
    }
    
    if (filters.intake_season) {
      totalQuery = totalQuery.where('programs.intake_season', filters.intake_season);
    }
    
    if (filters.accepts_minors !== undefined) {
      totalQuery = totalQuery.where('programs.accepts_minors', filters.accepts_minors);
    }
    
    if (filters.city_id) {
      totalQuery = totalQuery.where('universities.city_id', filters.city_id);
    }
    
    if (filters.search) {
      totalQuery = totalQuery.where(function() {
        this.where('programs.name', 'ilike', `%${filters.search}%`)
            .orWhere('programs.english_name', 'ilike', `%${filters.search}%`)
            .orWhere('universities.name', 'ilike', `%${filters.search}%`);
      });
    }

    // Apply deadline filter for total count
    totalQuery = totalQuery.where(function() {
      this.whereNull('programs.application_deadline')
          .orWhere('programs.application_deadline', '>=', new Date().toISOString().split('T')[0]);
    });

    const total = await totalQuery.count('* as count').first();

    return {
      programs,
      total: parseInt(total.count),
      limit,
      offset
    };
  }

  static async update(id, updates) {
    // Check if program_id is being updated and if it already exists
    if (updates.program_id) {
      const existingProgram = await db('programs')
        .where('program_id', updates.program_id)
        .where('id', '!=', id)
        .first();
      
      if (existingProgram) {
        throw new Error('Program ID already exists. Please choose a different Program ID.');
      }
    }
    
    const [program] = await db('programs')
      .where({ id })
      .update(updates)
      .returning('*');
    return program;
  }

  static async delete(id) {
    return await db('programs').where({ id }).del();
  }

  static async addRequirement(programId, requirementData) {
    const [requirement] = await db('program_requirements')
      .insert({ program_id: programId, ...requirementData })
      .returning('*');
    return requirement;
  }

  static async updateRequirement(requirementId, updates) {
    const [requirement] = await db('program_requirements')
      .where({ id: requirementId })
      .update(updates)
      .returning('*');
    return requirement;
  }

  static async deleteRequirement(requirementId) {
    return await db('program_requirements').where({ id: requirementId }).del();
  }

  static async getRequirements(programId) {
    return await db('program_requirements')
      .where('program_id', programId)
      .orderBy('sort_order', 'asc');
  }

  static async getFeatured() {
    return await db('programs')
      .leftJoin('universities', 'programs.university_id', 'universities.id')
      .leftJoin('cities', 'universities.city_id', 'cities.id')
      .select(
        'programs.*',
        'universities.name as university_name',
        'universities.logo_url as university_logo',
        'cities.name as city_name'
      )
      .where('programs.is_featured', true)
      .where('programs.is_active', true)
      .orderBy('programs.created_at', 'desc')
      .limit(12);
  }
}

module.exports = Program;
