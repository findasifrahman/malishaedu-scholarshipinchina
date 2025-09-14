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

// Get most applied program this week
router.get('/most-applied-program', async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const mostApplied = await db('student_programs')
      .leftJoin('programs', 'student_programs.program_id', 'programs.id')
      .leftJoin('universities', 'programs.university_id', 'universities.id')
      .leftJoin('cities', 'universities.city_id', 'cities.id')
      .select(
        'programs.name',
        'universities.name as university_name',
        'cities.name as city_name',
        db.raw('COUNT(student_programs.id) as application_count')
      )
      .where('student_programs.created_at', '>=', oneWeekAgo.toISOString())
      .groupBy('programs.id', 'programs.name', 'universities.name', 'cities.name')
      .orderBy('application_count', 'desc')
      .first();

    if (mostApplied) {
      res.json({
        success: true,
        data: {
          name: mostApplied.name,
          university_name: mostApplied.university_name,
          city_name: mostApplied.city_name,
          application_count: parseInt(mostApplied.application_count)
        }
      });
    } else {
      res.json({
        success: true,
        data: null
      });
    }
  } catch (error) {
    console.error('Most applied program error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch most applied program' 
    });
  }
});

// Get weekly user registrations (last 7 days)
router.get('/weekly-registrations', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const registrations = await db('users')
      .select(
        db.raw('DATE(created_at) as date'),
        db.raw('COUNT(*) as count')
      )
      .where('created_at', '>=', sevenDaysAgo.toISOString())
      .groupBy(db.raw('DATE(created_at)'))
      .orderBy('date', 'asc');

    // Create array for last 7 days with counts
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      
      const dayData = registrations.find(r => {
        const regDate = new Date(r.date);
        return regDate.toDateString() === date.toDateString();
      });
      
      weeklyData.push({
        day: dayName,
        count: dayData ? parseInt(dayData.count) : 0
      });
    }

    res.json({
      success: true,
      data: weeklyData
    });
  } catch (error) {
    console.error('Weekly registrations error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch weekly registrations' 
    });
  }
});

module.exports = router;
