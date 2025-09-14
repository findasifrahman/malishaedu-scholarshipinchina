const Joi = require('joi');

const schemas = {
  // User validation schemas
  userRegistration: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }),
    confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match'
    }),
    first_name: Joi.string().min(2).max(50).optional(),
    last_name: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().optional(),
    city: Joi.string().min(2).max(100).optional(),
    nationality: Joi.string().optional(),
    email_code: Joi.string().length(6).required()
  }),

  emailVerification: Joi.object({
    email: Joi.string().email().required()
  }),

  verifyEmailCode: Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().length(6).required()
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }),
    confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match'
    })
  }),

  userUpdate: Joi.object({
    first_name: Joi.string().min(2).max(50).optional(),
    last_name: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().optional(),
    date_of_birth: Joi.date().optional().allow(null, ''),
    nationality: Joi.string().optional(),
    passport_number: Joi.string().optional().allow(null, ''),
    address: Joi.string().optional().allow(null, ''),
    city: Joi.string().optional().allow(null, '')
  }),

  passwordChange: Joi.object({
    current_password: Joi.string().required(),
    new_password: Joi.string().min(6).required()
  }),

  // University validation schemas
  university: Joi.object({
    // Core fields
    name: Joi.string().min(2).max(200).required(),
    english_name: Joi.string().min(2).max(200).optional().allow('', null),
    description: Joi.string().optional().allow('', null),
    about: Joi.string().optional().allow('', null),
    website: Joi.string().optional().allow('', null).custom((value, helpers) => {
      if (!value || value === '') {
        return value; // Allow empty/null values
      }
      // Only validate URI format if value is provided
      try {
        new URL(value);
        return value;
      } catch {
        return helpers.error('string.uri');
      }
    }),
    youtube_video_id: Joi.string().optional().allow('', null),
    city_id: Joi.number().integer().positive().optional(),
    address: Joi.string().optional().allow('', null),
    phone: Joi.string().optional().allow('', null),
    email: Joi.string().optional().allow('', null).custom((value, helpers) => {
      if (!value || value === '') {
        return value; // Allow empty/null values
      }
      // Only validate email format if value is provided
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return helpers.error('string.email');
      }
      return value;
    }),
    logo_url: Joi.string().optional().allow('', null).custom((value, helpers) => {
      if (!value || value === '') {
        return value; // Allow empty/null values
      }
      // Only validate URI format if value is provided
      try {
        new URL(value);
        return value;
      } catch {
        return helpers.error('string.uri');
      }
    }),
    banner_image_url: Joi.string().optional().allow('', null).custom((value, helpers) => {
      if (!value || value === '') {
        return value; // Allow empty/null values
      }
      // Only validate URI format if value is provided
      try {
        new URL(value);
        return value;
      } catch {
        return helpers.error('string.uri');
      }
    }),
    ranking: Joi.number().integer().positive().optional(),
    type: Joi.string().valid('public', 'private', 'international').optional(),
    is_featured: Joi.boolean().required().custom((value, helpers) => {
      // Handle string boolean values
      if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
      }
      if (typeof value === 'boolean') return value;
      return helpers.error('boolean.base');
    }),
    is_active: Joi.boolean().optional().custom((value, helpers) => {
      // Handle string boolean values and null/undefined
      if (value === null || value === undefined) return true; // Default to true
      if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
      }
      if (typeof value === 'boolean') return value;
      return helpers.error('boolean.base');
    }),
    
    // Fields that come from database joins (for edit operations)
    id: Joi.number().integer().positive().optional(),
    created_at: Joi.date().optional(),
    updated_at: Joi.date().optional(),
    city_name: Joi.string().optional(),
    city_province: Joi.string().optional()
  }).unknown(false), // Don't allow unknown fields

  // Program validation schemas
  program: Joi.object({
    university_id: Joi.number().integer().positive().required(),
    program_name_id: Joi.number().integer().positive().optional().allow(null),
    name: Joi.string().min(2).max(200).required(),
    english_name: Joi.string().min(2).max(200).optional().allow('', null),
    description: Joi.string().optional().allow('', null),
    degree_level: Joi.string().valid('bachelor', 'master', 'phd', 'language', 'preparatory').required(),
    language: Joi.string().valid('chinese', 'english', 'bilingual').required(),
    duration_years: Joi.number().integer().min(0).optional().allow(null),
    duration_months: Joi.number().integer().min(0).optional().allow(null),
    tuition_fee: Joi.number().min(0).optional().allow(null),
    accommodation_fee: Joi.number().min(0).optional().allow(null),
    scholarship_amount: Joi.number().min(0).optional().allow(null),
    scholarship_type: Joi.string().valid('full', 'partial', 'none').optional(),
    scholarship_description: Joi.string().optional().allow('', null),
    application_deadline: Joi.date().optional().allow(null),
    intake_date: Joi.date().optional().allow(null),
    intake_season: Joi.string().valid('spring', 'autumn', 'summer', 'winter').optional().allow('', null),
    accepts_minors: Joi.boolean().optional(),
    min_age: Joi.number().integer().positive().optional().allow(null),
    max_age: Joi.number().integer().positive().optional().allow(null),
    min_gpa: Joi.number().min(0).max(4).optional().allow(null).messages({
      'number.max': 'Minimum GPA must be between 0 and 4.0',
      'number.min': 'Minimum GPA must be between 0 and 4.0'
    }),
    min_ielts_score: Joi.number().min(0).max(9).optional().allow(null).messages({
      'number.max': 'IELTS score must be between 0 and 9.0',
      'number.min': 'IELTS score must be between 0 and 9.0'
    }),
    min_toefl_score: Joi.number().min(0).max(120).optional().allow(null).messages({
      'number.max': 'TOEFL score must be between 0 and 120',
      'number.min': 'TOEFL score must be between 0 and 120'
    }),
    min_hsk_level: Joi.number().integer().min(1).max(6).optional().allow(null),
    additional_requirements: Joi.string().optional().allow('', null),
    is_featured: Joi.boolean().optional(),
    is_active: Joi.boolean().optional(),
    
    // New additional fields
    program_id: Joi.string().min(2).max(50).required(),
    scholarship_category: Joi.string().min(1).max(100).optional().allow('', null),
    tuition_fee_unit: Joi.string().valid('semester', 'year').optional().default('year'),
    accommodation_cost_unit: Joi.string().valid('day', 'month', 'semester', 'year').optional().default('year'),
    no_of_semesters_per_year: Joi.number().integer().min(1).max(4).optional().default(2),
    service_fee: Joi.number().min(0).optional().default(0),
    application_fee: Joi.number().min(0).optional().default(0),
    teaching_language: Joi.string().valid('chinese', 'english').required(),
    program_field: Joi.string().min(2).max(200).required(),
    scholarship_duration: Joi.number().positive().optional().allow(null),
    scholarship_policy: Joi.string().optional().allow('', null),
    accept_students_who_come_to_china: Joi.boolean().required(),
    acceptable_student_location: Joi.string().optional().allow('', null),
    application_documents: Joi.string().min(5).required(),
    special_notes: Joi.string().optional().allow('', null)
  }),

  // City validation schemas
  city: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    province: Joi.string().min(2).max(100).required(),
    description: Joi.string().optional().allow(''),
    image_url: Joi.string().uri().optional().allow('', null)
  }),

  // Requirement validation schemas
  requirement: Joi.object({
    requirement_type: Joi.string().valid('academic', 'language', 'document', 'other').required(),
    title: Joi.string().min(2).max(200).required(),
    description: Joi.string().optional(),
    is_required: Joi.boolean().optional(),
    sort_order: Joi.number().integer().min(0).optional()
  }),

  // Program Name validation schemas
  programName: Joi.object({
    id: Joi.number().integer().optional(),
    name: Joi.string().min(2).max(200).required()
  })
};

// Helper function to extract YouTube video ID from URL
const extractYouTubeVideoId = (url) => {
  if (!url) return '';
  
  // If it's already just an ID (11 characters), return as is
  if (url.length === 11 && !url.includes('/')) {
    return url;
  }
  
  // Extract from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return url; // Return original if no pattern matches
};

const validate = (schemaName) => {
  return (req, res, next) => {
    // Get the actual schema from the schemas object
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({ error: `Validation schema '${schemaName}' not found` });
    }

    // Pre-process the data only for specific schemas that need it
    if (schemaName === 'university') {
      if (req.body.youtube_video_id) {
        req.body.youtube_video_id = extractYouTubeVideoId(req.body.youtube_video_id);
      }
      
      // Convert ranking to number if it's a string
      if (req.body.ranking && typeof req.body.ranking === 'string') {
        req.body.ranking = parseInt(req.body.ranking);
      }
      
      // Convert city_id to number if it's a string
      if (req.body.city_id && typeof req.body.city_id === 'string') {
        req.body.city_id = parseInt(req.body.city_id);
      }
      
      // Convert empty strings to null for optional fields
      const optionalFields = ['email', 'phone', 'address', 'website', 'logo_url', 'banner_image_url', 'youtube_video_id', 'description', 'about', 'english_name'];
      optionalFields.forEach(field => {
        if (req.body[field] === '') {
          req.body[field] = null;
        }
      });
    }
    
    console.log('Validating data:', JSON.stringify(req.body, null, 2));
    
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      console.error('Validation error details:', error.details);
      console.error('Failed fields:', error.details.map(d => ({ field: d.path.join('.'), message: d.message, value: d.context?.value })));
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => `${detail.path.join('.')}: ${detail.message}`)
      });
    }
    
    console.log('Validation successful, processed data:', JSON.stringify(value, null, 2));
    
    // Filter out database-only fields before passing to model
    const { id, created_at, updated_at, city_name, city_province, ...cleanData } = value;
    req.body = cleanData; // Use the validated and processed data without DB fields
    
    next();
  };
};

module.exports = {
  schemas,
  validate
};
