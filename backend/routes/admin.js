const express = require('express');
const User = require('../models/User');
const University = require('../models/University');
const Program = require('../models/Program');
const City = require('../models/City');
const ProgramName = require('../models/ProgramName');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validate } = require('../utils/validation');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const db = require('../database/connection');
    
    // Get total counts
    const totalUsers = await db('users').where('role', 'student').count('* as count').first();
    const totalUniversities = await db('universities').count('* as count').first();
    const totalPrograms = await db('programs').count('* as count').first();
    const totalCities = await db('cities').count('* as count').first();

    // Get user registration statistics by time periods
    const today = await db('users')
      .where('role', 'student')
      .whereRaw('DATE(created_at) = CURRENT_DATE')
      .count('* as count')
      .first();

    const yesterday = await db('users')
      .where('role', 'student')
      .whereRaw('DATE(created_at) = CURRENT_DATE - INTERVAL \'1 day\'')
      .count('* as count')
      .first();

    const lastWeek = await db('users')
      .where('role', 'student')
      .whereRaw('created_at >= CURRENT_DATE - INTERVAL \'7 days\' AND created_at < CURRENT_DATE')
      .count('* as count')
      .first();

    const thisMonth = await db('users')
      .where('role', 'student')
      .whereRaw('created_at >= DATE_TRUNC(\'month\', CURRENT_DATE)')
      .count('* as count')
      .first();

    // Get recent student registrations
    const recentUsers = await db('users')
      .select('id', 'email', 'first_name', 'last_name', 'role', 'created_at')
      .where('role', 'student')
      .orderBy('created_at', 'desc')
      .limit(20);

    // Get most applied program (today and yesterday)
    const mostAppliedProgram = await db('student_programs')
      .select(
        'programs.id as program_id',
        'program_names.name as program_name',
        'universities.name as university_name',
        db.raw('COUNT(*) as count')
      )
      .leftJoin('programs', 'student_programs.program_id', 'programs.id')
      .leftJoin('program_names', 'programs.program_name_id', 'program_names.id')
      .leftJoin('universities', 'programs.university_id', 'universities.id')
      .whereRaw('DATE(student_programs.created_at) >= CURRENT_DATE - INTERVAL \'1 day\'')
      .groupBy('programs.id', 'program_names.name', 'universities.name')
      .orderBy('count', 'desc')
      .first();

    // Get most applied university (today and yesterday)
    const mostAppliedUniversity = await db('student_programs')
      .select(
        'universities.name as university_name',
        'cities.name as city',
        db.raw('COUNT(*) as count')
      )
      .leftJoin('programs', 'student_programs.program_id', 'programs.id')
      .leftJoin('universities', 'programs.university_id', 'universities.id')
      .leftJoin('cities', 'universities.city_id', 'cities.id')
      .whereRaw('DATE(student_programs.created_at) >= CURRENT_DATE - INTERVAL \'1 day\'')
      .groupBy('universities.id', 'universities.name', 'cities.name')
      .orderBy('count', 'desc')
      .first();

    res.json({
      totals: {
        totalUsers: parseInt(totalUsers.count),
        totalUniversities: parseInt(totalUniversities.count),
        totalPrograms: parseInt(totalPrograms.count),
        totalCities: parseInt(totalCities.count)
      },
      userStats: {
        today: parseInt(today.count),
        yesterday: parseInt(yesterday.count),
        lastWeek: parseInt(lastWeek.count),
        thisMonth: parseInt(thisMonth.count)
      },
      recentUsers,
      mostAppliedProgram: mostAppliedProgram ? {
        count: parseInt(mostAppliedProgram.count),
        program_id: mostAppliedProgram.program_id,
        program_name: mostAppliedProgram.program_name,
        university_name: mostAppliedProgram.university_name
      } : null,
      mostAppliedUniversity: mostAppliedUniversity ? {
        count: parseInt(mostAppliedUniversity.count),
        university_name: mostAppliedUniversity.university_name,
        city: mostAppliedUniversity.city
      } : null
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const db = require('../database/connection');
    const { 
      page = 1, 
      limit = 20, 
      search,
      email,
      name,
      role,
      dateFrom,
      dateTo
    } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = db('users').select('*');
    let totalQuery = db('users');
    
    // Apply filters
    if (search) {
      query = query.where(function() {
        this.where('first_name', 'ilike', `%${search}%`)
            .orWhere('last_name', 'ilike', `%${search}%`)
            .orWhere('email', 'ilike', `%${search}%`);
      });
      totalQuery = totalQuery.where(function() {
        this.where('first_name', 'ilike', `%${search}%`)
            .orWhere('last_name', 'ilike', `%${search}%`)
            .orWhere('email', 'ilike', `%${search}%`);
      });
    }

    if (email) {
      query = query.where('email', 'ilike', `%${email}%`);
      totalQuery = totalQuery.where('email', 'ilike', `%${email}%`);
    }

    if (name) {
      query = query.where(function() {
        this.where('first_name', 'ilike', `%${name}%`)
            .orWhere('last_name', 'ilike', `%${name}%`);
      });
      totalQuery = totalQuery.where(function() {
        this.where('first_name', 'ilike', `%${name}%`)
            .orWhere('last_name', 'ilike', `%${name}%`);
      });
    }

    if (role) {
      query = query.where('role', role);
      totalQuery = totalQuery.where('role', role);
    }

    if (dateFrom) {
      query = query.whereRaw('DATE(created_at) >= ?', [dateFrom]);
      totalQuery = totalQuery.whereRaw('DATE(created_at) >= ?', [dateFrom]);
    }

    if (dateTo) {
      query = query.whereRaw('DATE(created_at) <= ?', [dateTo]);
      totalQuery = totalQuery.whereRaw('DATE(created_at) <= ?', [dateTo]);
    }

    const users = await query
      .limit(parseInt(limit))
      .offset(offset)
      .orderBy('created_at', 'desc');

    const total = await totalQuery.count('* as count').first();

    res.json({
      users,
      total: parseInt(total.count),
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(parseInt(total.count) / parseInt(limit))
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user details with applied programs
router.get('/users/:id/programs', async (req, res) => {
  try {
    const { id } = req.params;
    const db = require('../database/connection');
    
    // Get user details with all fields
    const user = await db('users')
      .select('*')
      .where('id', id)
      .first();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = user;

    // Get user's applied programs
    const programs = await db('student_programs')
      .select(
        'student_programs.*',
        'programs.*',
        'program_names.name as program_name',
        'universities.name as university_name'
      )
      .leftJoin('programs', 'student_programs.program_id', 'programs.id')
      .leftJoin('program_names', 'programs.program_name_id', 'program_names.id')
      .leftJoin('universities', 'programs.university_id', 'universities.id')
      .where('student_programs.user_id', id)
      .orderBy('student_programs.created_at', 'desc');

    res.json({ 
      user: userWithoutPassword,
      programs: programs.map(program => ({
        id: program.id,
        status: program.status,
        created_at: program.created_at,
        updated_at: program.updated_at,
        program_name: { name: program.program_name },
        university: { name: program.university_name },
        degree_level: program.degree_level,
        language: program.language,
        tuition_fee: program.tuition_fee,
        scholarship_amount: program.scholarship_amount
      }))
    });
  } catch (error) {
    console.error('Get user programs error:', error);
    res.status(500).json({ error: 'Failed to fetch user programs' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow updating password through this route
    delete updates.password;
    delete updates.password_hash;

    const user = await User.update(id, updates);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Don't allow deleting own account
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const deleted = await User.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// University management
router.get('/universities', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const filters = {};
    if (search) filters.search = search;

    const result = await University.getAll(filters, parseInt(limit), offset, true);

    res.json({
      ...result,
      page: parseInt(page),
      totalPages: Math.ceil(result.total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get universities error:', error);
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
});

router.post('/universities', async (req, res) => {
  try {
    const university = await University.create(req.body);
    res.status(201).json({
      message: 'University created successfully',
      university
    });
  } catch (error) {
    console.error('Create university error:', error);
    res.status(500).json({ error: 'Failed to create university' });
  }
});

// Program management
router.get('/programs', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search,
      university_id,
      degree_level,
      language,
      scholarship_type,
      intake_season,
      accepts_minors,
      city_id
    } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const filters = {};
    if (search) filters.search = search;
    if (university_id) filters.university_id = parseInt(university_id);
    if (degree_level) filters.degree_level = degree_level;
    if (language) filters.language = language;
    if (scholarship_type) filters.scholarship_type = scholarship_type;
    if (intake_season) filters.intake_season = intake_season;
    if (accepts_minors !== undefined) filters.accepts_minors = accepts_minors === 'true';
    if (city_id) filters.city_id = parseInt(city_id);

    const result = await Program.getAll(filters, parseInt(limit), offset, true); // includeInactive = true for admin

    res.json({
      ...result,
      page: parseInt(page),
      totalPages: Math.ceil(result.total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
});

router.post('/programs', async (req, res) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json({
      message: 'Program created successfully',
      program
    });
  } catch (error) {
    console.error('Create program error:', error);
    res.status(500).json({ error: 'Failed to create program' });
  }
});

// City management
router.get('/cities', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await City.getAll(parseInt(limit), offset);

    res.json({
      ...result,
      page: parseInt(page),
      totalPages: Math.ceil(result.total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

router.post('/cities', async (req, res) => {
  try {
    const city = await City.create(req.body);
    res.status(201).json({
      message: 'City created successfully',
      city
    });
  } catch (error) {
    console.error('Create city error:', error);
    res.status(500).json({ error: 'Failed to create city' });
  }
});

// Program Names admin routes
router.get('/program-names', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const programNames = await ProgramName.getAll();

    // Apply pagination
    const total = programNames.length;
    const paginatedProgramNames = programNames.slice(offset, offset + parseInt(limit));

    res.json({
      programNames: paginatedProgramNames,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get program names error:', error);
    res.status(500).json({ error: 'Failed to fetch program names' });
  }
});

router.post('/program-names', validate('programName'), async (req, res) => {
  try {
    // Check if program name already exists
    const existingProgramName = await ProgramName.findByName(req.body.name);
    if (existingProgramName) {
      return res.status(400).json({ error: 'Program name already exists' });
    }

    const programName = await ProgramName.create(req.body);
    res.status(201).json({
      message: 'Program name created successfully',
      programName
    });
  } catch (error) {
    console.error('Create program name error:', error);
    res.status(500).json({ error: 'Failed to create program name' });
  }
});

router.put('/program-names/:id', validate('programName'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if program name exists
    const existingProgramName = await ProgramName.findById(id);
    if (!existingProgramName) {
      return res.status(404).json({ error: 'Program name not found' });
    }

    // Check if new name conflicts with existing program name (excluding current one)
    if (req.body.name !== existingProgramName.name) {
      const nameConflict = await ProgramName.findByName(req.body.name);
      if (nameConflict) {
        return res.status(400).json({ error: 'Program name already exists' });
      }
    }

    const programName = await ProgramName.update(id, req.body);
    res.json({
      message: 'Program name updated successfully',
      programName
    });
  } catch (error) {
    console.error('Update program name error:', error);
    res.status(500).json({ error: 'Failed to update program name' });
  }
});

router.delete('/program-names/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if program name exists
    const existingProgramName = await ProgramName.findById(id);
    if (!existingProgramName) {
      return res.status(404).json({ error: 'Program name not found' });
    }

    await ProgramName.delete(id);
    res.json({ message: 'Program name deleted successfully' });
  } catch (error) {
    console.error('Delete program name error:', error);
    res.status(500).json({ error: 'Failed to delete program name' });
  }
});

module.exports = router;
