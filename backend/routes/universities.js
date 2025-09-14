const express = require('express');
const University = require('../models/University');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validation');
const { deleteFromR2, extractKeyFromUrl } = require('./uploads');

const router = express.Router();

// Get all universities (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      city_id, 
      is_featured, 
      search 
    } = req.query;

    const filters = {};
    if (city_id) filters.city_id = parseInt(city_id);
    if (is_featured === 'true') filters.is_featured = true;
    if (search) filters.search = search;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const result = await University.getAll(filters, parseInt(limit), offset);

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

// Get all university images for gallery (public) - must be before /:id route
router.get('/gallery/images', async (req, res) => {
  try {
    const db = require('../database/connection');
    const images = await db('university_images')
      .join('universities', 'university_images.university_id', 'universities.id')
      .select(
        'university_images.*',
        'universities.name as university_name'
      )
      .where('universities.is_active', true)
      .orderBy('university_images.sort_order', 'asc')
      .orderBy('university_images.created_at', 'desc');

    res.json({ images });
  } catch (error) {
    console.error('Get gallery images error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

// Get single university (public)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const university = await University.findById(id);

    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }

    res.json({ university });
  } catch (error) {
    console.error('Get university error:', error);
    res.status(500).json({ error: 'Failed to fetch university' });
  }
});

// Create university (admin only)
router.post('/', authenticateToken, requireAdmin, validate('university'), async (req, res) => {
  try {
    console.log('Creating university with data:', JSON.stringify(req.body, null, 2));
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

// Update university (admin only)
router.put('/:id', authenticateToken, requireAdmin, validate('university'), async (req, res) => {
  try {
    const { id } = req.params;
    const university = await University.update(id, req.body);

    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }

    res.json({
      message: 'University updated successfully',
      university
    });
  } catch (error) {
    console.error('Update university error:', error);
    res.status(500).json({ error: 'Failed to update university' });
  }
});

// Delete university (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await University.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'University not found' });
    }

    res.json({ message: 'University deleted successfully' });
  } catch (error) {
    console.error('Delete university error:', error);
    res.status(500).json({ error: 'Failed to delete university' });
  }
});

// Add image to university (admin only)
router.post('/:id/images', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url, alt_text, sort_order, is_featured } = req.body;

    const image = await University.addImage(id, {
      image_url,
      alt_text,
      sort_order: sort_order || 0,
      is_featured: is_featured || false
    });

    res.status(201).json({
      message: 'Image added successfully',
      image
    });
  } catch (error) {
    console.error('Add university image error:', error);
    res.status(500).json({ error: 'Failed to add image' });
  }
});

// Update university image (admin only)
router.put('/images/:imageId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { imageId } = req.params;
    const updates = req.body;

    const image = await University.updateImage(imageId, updates);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({
      message: 'Image updated successfully',
      image
    });
  } catch (error) {
    console.error('Update university image error:', error);
    res.status(500).json({ error: 'Failed to update image' });
  }
});

// Delete university image (admin only)
router.delete('/images/:imageId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { imageId } = req.params;
    
    // First get the image to get the URL for R2 deletion
    const db = require('../database/connection');
    const image = await db('university_images').where('id', imageId).first();
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete from database
    const deleted = await University.deleteImage(imageId);

    if (!deleted) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete from R2 if URL exists
    if (image.image_url) {
      const key = extractKeyFromUrl(image.image_url);
      if (key) {
        await deleteFromR2(key);
      }
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete university image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Get university images (public)
router.get('/:id/images', async (req, res) => {
  try {
    const { id } = req.params;
    const images = await University.getImages(id);

    res.json({ images });
  } catch (error) {
    console.error('Get university images error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

module.exports = router;
