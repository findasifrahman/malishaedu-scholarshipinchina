const express = require('express');
const Program = require('../models/Program');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validation');

const router = express.Router();

// Get all programs (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      university_id,
      degree_level,
      language,
      scholarship_type,
      intake_season,
      accepts_minors,
      city_id,
      search 
    } = req.query;

    const filters = {};
    if (university_id) filters.university_id = parseInt(university_id);
    if (degree_level) filters.degree_level = degree_level;
    if (language) filters.language = language;
    if (scholarship_type) filters.scholarship_type = scholarship_type;
    if (intake_season) filters.intake_season = intake_season;
    if (accepts_minors !== undefined) filters.accepts_minors = accepts_minors === 'true';
    if (city_id) filters.city_id = parseInt(city_id);
    if (search) filters.search = search;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const result = await Program.getAll(filters, parseInt(limit), offset);

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

// Get featured programs (public) ADD NEW
router.get('/featured', async (req, res) => {
  try {
    const programs = await Program.getFeatured();
    res.json({ programs });
  } catch (error) {
    console.error('Get featured programs error:', error);
    res.status(500).json({ error: 'Failed to fetch featured programs' });
  }
});

// Get single program (public)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate that id is a valid integer
    const programId = parseInt(id);
    if (isNaN(programId) || programId <= 0) {
      return res.status(400).json({ error: 'Invalid program ID' });
    }
    
    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    res.json({ program });
  } catch (error) {
    console.error('Get program error:', error);
    res.status(500).json({ error: 'Failed to fetch program' });
  }
});

// Create program (admin only)
router.post('/', authenticateToken, requireAdmin, validate('program'), async (req, res) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json({
      message: 'Program created successfully',
      program
    });
  } catch (error) {
    console.error('Create program error:', error);
    
    // Handle program ID uniqueness error
    if (error.message && error.message.includes('Program ID already exists')) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ error: 'Failed to create program' });
  }
});

// Update program (admin only)
router.put('/:id', authenticateToken, requireAdmin, validate('program'), async (req, res) => {
  try {
    const { id } = req.params;
    const program = await Program.update(id, req.body);

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    res.json({
      message: 'Program updated successfully',
      program
    });
  } catch (error) {
    console.error('Update program error:', error);
    
    // Handle program ID uniqueness error
    if (error.message && error.message.includes('Program ID already exists')) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ error: 'Failed to update program' });
  }
});

// Delete program (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Program.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Program not found' });
    }

    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Delete program error:', error);
    res.status(500).json({ error: 'Failed to delete program' });
  }
});

// Add requirement to program (admin only)
router.post('/:id/requirements', authenticateToken, requireAdmin, validate('requirement'), async (req, res) => {
  try {
    const { id } = req.params;
    const requirement = await Program.addRequirement(id, req.body);

    res.status(201).json({
      message: 'Requirement added successfully',
      requirement
    });
  } catch (error) {
    console.error('Add program requirement error:', error);
    res.status(500).json({ error: 'Failed to add requirement' });
  }
});

// Update program requirement (admin only)
router.put('/requirements/:requirementId', authenticateToken, requireAdmin, validate('requirement'), async (req, res) => {
  try {
    const { requirementId } = req.params;
    const requirement = await Program.updateRequirement(requirementId, req.body);

    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    res.json({
      message: 'Requirement updated successfully',
      requirement
    });
  } catch (error) {
    console.error('Update program requirement error:', error);
    res.status(500).json({ error: 'Failed to update requirement' });
  }
});

// Delete program requirement (admin only)
router.delete('/requirements/:requirementId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { requirementId } = req.params;
    const deleted = await Program.deleteRequirement(requirementId);

    if (!deleted) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    res.json({ message: 'Requirement deleted successfully' });
  } catch (error) {
    console.error('Delete program requirement error:', error);
    res.status(500).json({ error: 'Failed to delete requirement' });
  }
});

// Get program requirements (public)
router.get('/:id/requirements', async (req, res) => {
  try {
    const { id } = req.params;
    const requirements = await Program.getRequirements(id);

    res.json({ requirements });
  } catch (error) {
    console.error('Get program requirements error:', error);
    res.status(500).json({ error: 'Failed to fetch requirements' });
  }
});

module.exports = router;
