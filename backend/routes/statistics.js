const express = require('express');
const db = require('../database/connection');

const router = express.Router();

// Get statistics data
router.get('/', async (req, res) => {
  try {
    // Get total universities count
    const universitiesCount = await db('universities')
      .where('is_active', true)
      .count('* as count')
      .first();

    // Get total programs count
    const programsCount = await db('programs')
      .where('is_active', true)
      .count('* as count')
      .first();

    // Get total registered users count
    const usersCount = await db('users')
      .count('* as count')
      .first();

    // Get users with complete profiles (users who have filled most required fields)
    const completeProfilesCount = await db('users')
      .where(function() {
        this.whereNotNull('first_name')
            .whereNotNull('last_name')
            .whereNotNull('phone')
            .whereNotNull('nationality')
            .whereNotNull('date_of_birth')
            .whereNotNull('passport_number')
            .whereNotNull('address')
            .whereNotNull('city');
      })
      .count('* as count')
      .first();

    res.json({
      success: true,
      data: {
        partnerUniversities: parseInt(universitiesCount.count),
        scholarshipPrograms: parseInt(programsCount.count),
        successfulApplications: parseInt(usersCount.count),
        happyStudents: parseInt(completeProfilesCount.count)
      }
    });
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch statistics' 
    });
  }
});

module.exports = router;
