const express = require('express');
const router = express.Router();
const ProgramName = require('../models/ProgramName');
const { validate } = require('../utils/validation');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all program names (public)
router.get('/', async (req, res) => {
  try {
    const programNames = await ProgramName.getAll();
    res.json({ programNames });
  } catch (error) {
    console.error('Get program names error:', error);
    res.status(500).json({ error: 'Failed to fetch program names' });
  }
});

// Get single program name (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const programName = await ProgramName.findById(id);

    if (!programName) {
      return res.status(404).json({ error: 'Program name not found' });
    }

    res.json({ programName });
  } catch (error) {
    console.error('Get program name error:', error);
    res.status(500).json({ error: 'Failed to fetch program name' });
  }
});

// Create program name (admin only)
router.post('/', authenticateToken, requireAdmin, validate('programName'), async (req, res) => {
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

// Update program name (admin only)
router.put('/:id', authenticateToken, requireAdmin, validate('programName'), async (req, res) => {
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

// Delete program name (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
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
