const express = require('express');
const City = require('../models/City');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validation');

const router = express.Router();

// Get all cities (public)
router.get('/', async (req, res) => {
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

// Get cities by province (public)
router.get('/province/:province', async (req, res) => {
  try {
    const { province } = req.params;
    const cities = await City.getByProvince(province);
    res.json({ cities });
  } catch (error) {
    console.error('Get cities by province error:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// Get all provinces (public)
router.get('/provinces', async (req, res) => {
  try {
    const provinces = await City.getProvinces();
    res.json({ provinces });
  } catch (error) {
    console.error('Get provinces error:', error);
    res.status(500).json({ error: 'Failed to fetch provinces' });
  }
});

// Get single city (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const city = await City.findById(id);

    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json({ city });
  } catch (error) {
    console.error('Get city error:', error);
    res.status(500).json({ error: 'Failed to fetch city' });
  }
});

// Create city (admin only)
router.post('/', authenticateToken, requireAdmin, validate('city'), async (req, res) => {
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

// Update city (admin only)
router.put('/:id', authenticateToken, requireAdmin, validate('city'), async (req, res) => {
  try {
    const { id } = req.params;
    const city = await City.update(id, req.body);

    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json({
      message: 'City updated successfully',
      city
    });
  } catch (error) {
    console.error('Update city error:', error);
    res.status(500).json({ error: 'Failed to update city' });
  }
});

// Delete city (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await City.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json({ message: 'City deleted successfully' });
  } catch (error) {
    console.error('Delete city error:', error);
    res.status(500).json({ error: 'Failed to delete city' });
  }
});

module.exports = router;
