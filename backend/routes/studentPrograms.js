const express = require('express');
const StudentProgram = require('../models/StudentProgram');
const Program = require('../models/Program');
const User = require('../models/User');
const db = require('../database/connection');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validation');

const router = express.Router();

// Get all programs applied by a user (user's own applications)
router.get('/my-applications', authenticateToken, async (req, res) => {
  try {
    const applications = await StudentProgram.findByUserId(req.user.id);
    res.json({ applications });
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Apply to a program (user only)
router.post('/apply', authenticateToken, async (req, res) => {
  try {
    const { program_id, scholarship_type = 'none' } = req.body;
    
    if (!program_id) {
      return res.status(400).json({ error: 'Program ID is required' });
    }

    // Validate scholarship type
    const validScholarshipTypes = ['none', 'partial', 'full', '50_percent'];
    if (!validScholarshipTypes.includes(scholarship_type)) {
      return res.status(400).json({ error: 'Invalid scholarship type' });
    }

    // Check if program exists
    const program = await Program.findById(program_id);
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    // Check if user already applied to this program
    const existingApplication = await StudentProgram.findByUserAndProgram(req.user.id, program_id);
    if (existingApplication) {
      return res.status(400).json({ error: 'You already applied for this program. Please remove to reapply.' });
    }

    // Create application
    const application = await StudentProgram.create(req.user.id, program_id, scholarship_type);
    
    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Apply to program error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Remove application from a program (user only)
router.delete('/remove/:programId', authenticateToken, async (req, res) => {
  try {
    const { programId } = req.params;
    
    const deleted = await StudentProgram.delete(req.user.id, programId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ message: 'Application removed successfully' });
  } catch (error) {
    console.error('Remove application error:', error);
    res.status(500).json({ error: 'Failed to remove application' });
  }
});

// Get all applications for a specific program (admin only)
router.get('/program/:programId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { programId } = req.params;
    
    const applications = await StudentProgram.findByProgramId(programId);
    res.json({ applications });
  } catch (error) {
    console.error('Get program applications error:', error);
    res.status(500).json({ error: 'Failed to fetch program applications' });
  }
});

// Get all applications (admin only)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const applications = await db('student_programs')
      .leftJoin('users', 'student_programs.user_id', 'users.id')
      .leftJoin('programs', 'student_programs.program_id', 'programs.id')
      .leftJoin('universities', 'programs.university_id', 'universities.id')
      .select(
        'student_programs.*',
        'users.first_name',
        'users.last_name',
        'users.email',
        'users.nationality',
        'programs.name as program_name',
        'universities.name as university_name'
      )
      .limit(parseInt(limit))
      .offset(offset)
      .orderBy('student_programs.created_at', 'desc');
    
    const total = await StudentProgram.getTotalApplications();
    
    res.json({
      applications,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get application statistics (admin only)
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await StudentProgram.getApplicationStats();
    const totalApplications = await StudentProgram.getTotalApplications();
    const uniqueStudents = await StudentProgram.getUniqueStudents();
    
    res.json({
      programStats: stats,
      totalApplications,
      uniqueStudents
    });
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({ error: 'Failed to fetch application statistics' });
  }
});

// Remove application by ID (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await StudentProgram.deleteById(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ message: 'Application removed successfully' });
  } catch (error) {
    console.error('Remove application by ID error:', error);
    res.status(500).json({ error: 'Failed to remove application' });
  }
});

module.exports = router;
