const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure AWS S3 (Cloudflare R2)
const s3 = new AWS.S3({
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  region: 'auto',
  signatureVersion: 'v4'
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB limit for university images
  },
  fileFilter: (req, file, cb) => {
    // For university images, only allow images
    if (req.route.path.includes('university')) {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for university uploads'), false);
      }
    } else {
      // For other uploads, allow images and PDFs
      if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only images and PDF files are allowed'), false);
      }
    }
  }
});

// Separate multer config for profile images with 512KB limit
const profileImageUpload = multer({
  storage,
  limits: {
    fileSize: 512 * 1024, // 512KB limit for profile images
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for profile images'), false);
    }
  }
});

// Upload file to R2
const uploadToR2 = async (file, key) => {
  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  return await s3.upload(params).promise();
};

// Upload profile image
router.post('/profile-image', authenticateToken, profileImageUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Additional file size check (multer should catch this, but just in case)
    if (req.file.size > 512 * 1024) {
      return res.status(400).json({ error: 'Profile image size must not exceed 512KB' });
    }

    const User = require('../models/User');
    
    // Get current user to check for existing profile image
    const user = await User.findById(req.user.id);
    
    // If user has an existing profile image, delete it from R2
    if (user && user.profile_image_url) {
      try {
        const oldKey = extractKeyFromUrl(user.profile_image_url);
        if (oldKey) {
          await deleteFromR2(oldKey);
          console.log(`Deleted old profile image: ${oldKey}`);
        }
      } catch (deleteError) {
        console.error('Error deleting old profile image:', deleteError);
        // Continue with upload even if deletion fails
      }
    }

    const fileExtension = req.file.originalname.split('.').pop();
    const key = `profile-images/${req.user.id}-${Date.now()}.${fileExtension}`;

    const result = await uploadToR2(req.file, key);
    
    // Convert to public URL
    const publicUrl = result.Location.replace(
      `https://malisha-edu-storage.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      process.env.R2_PUBLIC_URL
    );
    
    // Update user profile image URL
    await User.update(req.user.id, { profile_image_url: publicUrl });

    res.json({
      message: 'Profile image uploaded successfully',
      imageUrl: publicUrl
    });
  } catch (error) {
    console.error('Profile image upload error:', error);
    
    // Handle multer file size error
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Profile image size must not exceed 512KB' });
    }
    
    // Handle multer file type error
    if (error.message && error.message.includes('Only image files are allowed')) {
      return res.status(400).json({ error: 'Only image files are allowed for profile images' });
    }
    
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
});

// Upload passport image
router.post('/passport', authenticateToken, upload.single('passport'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const User = require('../models/User');
    
    // Get current user to check for existing passport image
    const user = await User.findById(req.user.id);
    
    // If user has an existing passport image, delete it from R2
    if (user && user.passport_image_url) {
      try {
        const oldKey = extractKeyFromUrl(user.passport_image_url);
        if (oldKey) {
          await deleteFromR2(oldKey);
          console.log(`Deleted old passport image: ${oldKey}`);
        }
      } catch (deleteError) {
        console.error('Error deleting old passport image:', deleteError);
        // Continue with upload even if deletion fails
      }
    }

    const fileExtension = req.file.originalname.split('.').pop();
    const key = `passports/${req.user.id}-${Date.now()}.${fileExtension}`;

    const result = await uploadToR2(req.file, key);
    
    // Convert to public URL
    const publicUrl = result.Location.replace(
      `https://malisha-edu-storage.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      process.env.R2_PUBLIC_URL
    );
    
    // Update user passport image URL
    await User.update(req.user.id, { passport_image_url: publicUrl });

    res.json({
      message: 'Passport uploaded successfully',
      imageUrl: publicUrl
    });
  } catch (error) {
    console.error('Passport upload error:', error);
    res.status(500).json({ error: 'Failed to upload passport' });
  }
});

// Upload university image (admin only)
router.post('/university-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check file size (additional check)
    if (req.file.size > 1 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size must be less than 1MB' });
    }

    const fileExtension = req.file.originalname.split('.').pop();
    const key = `university-images/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;

    const result = await uploadToR2(req.file, key);

    // Convert internal R2 URL to public URL
    // The internal URL format is: https://malisha-edu-storage.d64e7978ed801f4ac433d221e0cb0649.r2.cloudflarestorage.com
    // The public URL format is: https://pub-9c8141e374374e25a5892600464a26e3.r2.dev
    const publicUrl = result.Location.replace(
      `https://malisha-edu-storage.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      process.env.R2_PUBLIC_URL
    );

    res.json({
      message: 'University image uploaded successfully',
      imageUrl: publicUrl,
      key: key
    });
  } catch (error) {
    console.error('University image upload error:', error);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size must be less than 1MB' });
    }
    res.status(500).json({ error: 'Failed to upload university image' });
  }
});

// Upload university logo (admin only)
router.post('/university-logo', authenticateToken, upload.single('logo'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileExtension = req.file.originalname.split('.').pop();
    const key = `university-logos/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;

    const result = await uploadToR2(req.file, key);

    // Convert internal R2 URL to public URL
    // The internal URL format is: https://malisha-edu-storage.d64e7978ed801f4ac433d221e0cb0649.r2.cloudflarestorage.com
    // The public URL format is: https://pub-9c8141e374374e25a5892600464a26e3.r2.dev
    const publicUrl = result.Location.replace(
      `https://malisha-edu-storage.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      process.env.R2_PUBLIC_URL
    );

    res.json({
      message: 'University logo uploaded successfully',
      imageUrl: publicUrl,
      key: key
    });
  } catch (error) {
    console.error('University logo upload error:', error);
    res.status(500).json({ error: 'Failed to upload university logo' });
  }
});

// Upload university banner (admin only)
router.post('/university-banner', authenticateToken, upload.single('banner'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileExtension = req.file.originalname.split('.').pop();
    const key = `university-banners/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;

    const result = await uploadToR2(req.file, key);

    // Convert internal R2 URL to public URL
    // The internal URL format is: https://malisha-edu-storage.d64e7978ed801f4ac433d221e0cb0649.r2.cloudflarestorage.com
    // The public URL format is: https://pub-9c8141e374374e25a5892600464a26e3.r2.dev
    const publicUrl = result.Location.replace(
      `https://malisha-edu-storage.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      process.env.R2_PUBLIC_URL
    );

    res.json({
      message: 'University banner uploaded successfully',
      imageUrl: publicUrl,
      key: key
    });
  } catch (error) {
    console.error('University banner upload error:', error);
    res.status(500).json({ error: 'Failed to upload university banner' });
  }
});

// Generic document upload function
const uploadDocument = async (req, res, documentType, fieldName) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const User = require('../models/User');
    
    // Get current user to check for existing document
    const user = await User.findById(req.user.id);
    
    // If user has an existing document of this type, delete it from R2
    if (user && user[fieldName]) {
      try {
        const oldKey = extractKeyFromUrl(user[fieldName]);
        if (oldKey) {
          await deleteFromR2(oldKey);
          console.log(`Deleted old ${documentType}: ${oldKey}`);
        }
      } catch (deleteError) {
        console.error(`Error deleting old ${documentType}:`, deleteError);
        // Continue with upload even if deletion fails
      }
    }

    const fileExtension = req.file.originalname.split('.').pop();
    const key = `documents/${documentType}/${req.user.id}-${Date.now()}.${fileExtension}`;

    const result = await uploadToR2(req.file, key);
    
    // Convert to public URL
    const publicUrl = result.Location.replace(
      `https://malisha-edu-storage.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      process.env.R2_PUBLIC_URL
    );
    
    // Update user document URL
    const updateData = {};
    updateData[fieldName] = publicUrl;
    await User.update(req.user.id, updateData);

    res.json({
      message: `${documentType} uploaded successfully`,
      fileUrl: publicUrl
    });
  } catch (error) {
    console.error(`${documentType} upload error:`, error);
    res.status(500).json({ error: `Failed to upload ${documentType}` });
  }
};

// Document upload routes
router.post('/passport-scanned', authenticateToken, upload.single('file'), async (req, res) => {
  await uploadDocument(req, res, 'passport-scanned', 'passport_scanned_url');
});

router.post('/passport-photo', authenticateToken, upload.single('file'), async (req, res) => {
  await uploadDocument(req, res, 'passport-photo', 'passport_photo_url');
});

router.post('/academic-transcripts', authenticateToken, upload.single('file'), async (req, res) => {
  await uploadDocument(req, res, 'academic-transcripts', 'academic_transcripts_url');
});

router.post('/highest-degree-diploma', authenticateToken, upload.single('file'), async (req, res) => {
  await uploadDocument(req, res, 'highest-degree-diploma', 'highest_degree_diploma_url');
});

router.post('/physical-examination-form', authenticateToken, upload.single('file'), async (req, res) => {
  await uploadDocument(req, res, 'physical-examination-form', 'physical_examination_form_url');
});

router.post('/police-clearance', authenticateToken, upload.single('file'), async (req, res) => {
  await uploadDocument(req, res, 'police-clearance', 'police_clearance_url');
});

router.post('/chinese-language-certificate', authenticateToken, upload.single('file'), async (req, res) => {
  await uploadDocument(req, res, 'chinese-language-certificate', 'chinese_language_certificate_url');
});

router.post('/application-form', authenticateToken, upload.single('file'), async (req, res) => {
  await uploadDocument(req, res, 'application-form', 'application_form_url');
});

router.post('/recommendation-letter-1', authenticateToken, upload.single('file'), async (req, res) => {
  await uploadDocument(req, res, 'recommendation-letter-1', 'recommendation_letter_1_url');
});

router.post('/recommendation-letter-2', authenticateToken, upload.single('file'), async (req, res) => {
  await uploadDocument(req, res, 'recommendation-letter-2', 'recommendation_letter_2_url');
});

router.post('/guarantee-letter', authenticateToken, upload.single('file'), async (req, res) => {
  await uploadDocument(req, res, 'guarantee-letter', 'guarantee_letter_url');
});

router.post('/residence-permit', authenticateToken, upload.single('file'), async (req, res) => {
  await uploadDocument(req, res, 'residence-permit', 'residence_permit_url');
});

router.post('/study-certificate-china', authenticateToken, upload.single('file'), async (req, res) => {
  await uploadDocument(req, res, 'study-certificate-china', 'study_certificate_china_url');
});

router.post('/others-1', authenticateToken, upload.single('file'), async (req, res) => {
  await uploadDocument(req, res, 'others-1', 'others_1_url');
});

router.post('/others-2', authenticateToken, upload.single('file'), async (req, res) => {
  await uploadDocument(req, res, 'others-2', 'others_2_url');
});

// Upload general file
router.post('/general', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileExtension = req.file.originalname.split('.').pop();
    const key = `general/${req.user.id}-${Date.now()}.${fileExtension}`;

    const result = await uploadToR2(req.file, key);

    res.json({
      message: 'File uploaded successfully',
      fileUrl: result.Location
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Remove document from user profile
router.delete('/document/:documentType', authenticateToken, async (req, res) => {
  try {
    const { documentType } = req.params;
    const User = require('../models/User');
    
    // Map document types to database field names
    const documentFieldMap = {
      'passport-scanned': 'passport_scanned_url',
      'passport-photo': 'passport_photo_url',
      'academic-transcripts': 'academic_transcripts_url',
      'highest-degree-diploma': 'highest_degree_diploma_url',
      'physical-examination-form': 'physical_examination_form_url',
      'police-clearance': 'police_clearance_url',
      'chinese-language-certificate': 'chinese_language_certificate_url',
      'application-form': 'application_form_url',
      'recommendation-letter-1': 'recommendation_letter_1_url',
      'recommendation-letter-2': 'recommendation_letter_2_url',
      'guarantee-letter': 'guarantee_letter_url',
      'residence-permit': 'residence_permit_url',
      'study-certificate-china': 'study_certificate_china_url',
      'others-1': 'others_1_url',
      'others-2': 'others_2_url'
    };
    
    const fieldName = documentFieldMap[documentType];
    if (!fieldName) {
      return res.status(400).json({ error: 'Invalid document type' });
    }
    
    // Get current user to find the file URL
    const user = await User.findById(req.user.id);
    if (!user || !user[fieldName]) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Extract key from URL and delete from R2
    const key = extractKeyFromUrl(user[fieldName]);
    if (key) {
      await deleteFromR2(key);
    }
    
    // Remove URL from user profile
    const updateData = {};
    updateData[fieldName] = null;
    await User.update(req.user.id, updateData);
    
    res.json({ message: 'Document removed successfully' });
  } catch (error) {
    console.error('Document removal error:', error);
    res.status(500).json({ error: 'Failed to remove document' });
  }
});

// Delete file from R2
router.delete('/:key(*)', authenticateToken, async (req, res) => {
  try {
    const { key } = req.params;
    
    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key
    };

    await s3.deleteObject(params).promise();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Utility function to delete file from R2 (can be used by other routes)
const deleteFromR2 = async (key) => {
  try {
    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key
    };
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error('R2 deletion error:', error);
    return false;
  }
};

// Utility function to extract key from R2 URL
const extractKeyFromUrl = (url) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1); // Remove leading slash
  } catch (error) {
    console.error('Error extracting key from URL:', error);
    return null;
  }
};

module.exports = { router, deleteFromR2, extractKeyFromUrl };
