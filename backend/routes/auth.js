const express = require('express');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { authenticateToken } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validation');
const emailService = require('../utils/email');

const router = express.Router();

// Test email service connection
router.get('/test-email', async (req, res) => {
  try {
    const isConnected = await emailService.testConnection();
    if (isConnected) {
      res.json({ 
        success: true, 
        message: 'Email service is properly configured and connected' 
      });
    } else {
      res.json({ 
        success: false, 
        message: 'Email service is not configured or connection failed' 
      });
    }
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to test email service',
      details: error.message 
    });
  }
});

// Generate and send email verification code
router.post('/send-verification-code', validate('emailVerification'), async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes (120 seconds)

    // Store verification code in database (we'll use a simple in-memory store for now)
    // In production, you might want to use Redis or a separate table
    global.emailVerificationCodes = global.emailVerificationCodes || {};
    global.emailVerificationCodes[email] = {
      code,
      expiresAt
    };

    // Send email
    const emailResult = await emailService.sendVerificationCode(email, code);
    
    if (!emailResult.success) {
      // If email service is not configured, return a mock success for development
      if (emailResult.error === 'Email service not configured') {
        console.log(`Mock email verification code for ${email}: ${code}`);
        return res.json({ 
          message: 'Verification code sent successfully (mock mode)',
          expiresIn: 120,
          mockCode: code // Only for development
        });
      }
      
      // If email sending failed but we have a mock code for debugging
      if (emailResult.mockCode) {
        console.log(`Email sending failed, using mock code for ${email}: ${emailResult.mockCode}`);
        return res.json({ 
          message: 'Verification code sent successfully (fallback mode)',
          expiresIn: 120,
          mockCode: emailResult.mockCode // For debugging when email fails
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to send verification email',
        details: emailResult.error 
      });
    }

    res.json({ 
      message: 'Verification code sent successfully',
      expiresIn: 120 // 2 minutes in seconds
    });
  } catch (error) {
    console.error('Send verification code error:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// Verify email code
router.post('/verify-email-code', validate('verifyEmailCode'), async (req, res) => {
  try {
    const { email, code } = req.body;

    // Check if verification code exists and is valid
    global.emailVerificationCodes = global.emailVerificationCodes || {};
    const storedData = global.emailVerificationCodes[email];

    if (!storedData) {
      return res.status(400).json({ error: 'No verification code found for this email' });
    }

    if (new Date() > storedData.expiresAt) {
      delete global.emailVerificationCodes[email];
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    if (storedData.code !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Mark email as verified
    global.verifiedEmails = global.verifiedEmails || {};
    global.verifiedEmails[email] = true;

    // Clean up verification code
    delete global.emailVerificationCodes[email];

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email code error:', error);
    res.status(500).json({ error: 'Failed to verify email code' });
  }
});

// Register new user
router.post('/signup', validate('userRegistration'), async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      confirm_password,
      first_name, 
      last_name, 
      phone, 
      city,
      nationality,
      email_code
    } = req.body;
    
    console.log("email verification code");
    console.log(req.body);
    // Check if email is verified
    global.verifiedEmails = global.verifiedEmails || {};
    if (!global.verifiedEmails[email]) {
      return res.status(400).json({ error: 'Email not verified. Please verify your email first.' });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Check if username already exists
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Check if phone already exists (if provided)
    if (phone) {
      const existingPhone = await User.findByPhone(phone);
      if (existingPhone) {
        return res.status(400).json({ error: 'Phone number already registered' });
      }
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      first_name,
      last_name,
      phone,
      city,
      nationality,
      is_verified: true,
      email_verified_at: new Date()
    });

    // Clean up verified email
    delete global.verifiedEmails[email];

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', validate('userLogin'), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await User.update(user.id, { last_login_at: new Date() });

    // Generate JWT token
    const token = generateToken(user.id);

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, validate('userUpdate'), async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.update(req.user.id, updates);
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/change-password', authenticateToken, validate('passwordChange'), async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    // Get user with password hash
    const user = await User.findByEmail(req.user.email);
    
    // Verify current password
    const isValidPassword = await User.verifyPassword(current_password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    await User.updatePassword(req.user.id, new_password);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Upload profile image
router.post('/upload-profile-image', authenticateToken, async (req, res) => {
  try {
    // This will be handled by the upload middleware
    // For now, just return a placeholder response
    res.json({ message: 'Profile image upload endpoint - to be implemented with multer' });
  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
});

// Upload passport image
router.post('/upload-passport', authenticateToken, async (req, res) => {
  try {
    // This will be handled by the upload middleware
    // For now, just return a placeholder response
    res.json({ message: 'Passport upload endpoint - to be implemented with multer' });
  } catch (error) {
    console.error('Passport upload error:', error);
    res.status(500).json({ error: 'Failed to upload passport' });
  }
});

// Forgot password - send reset link
router.post('/forgot-password', validate('forgotPassword'), async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    // Generate reset token (simple implementation for now)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token in memory (in production, use Redis or database)
    global.passwordResetTokens = global.passwordResetTokens || {};
    global.passwordResetTokens[resetToken] = {
      userId: user.id,
      email: user.email,
      expiresAt
    };

    // Send email with reset link (mock for now)
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    // Mock email sending
    console.log(`Password reset link for ${email}: ${resetLink}`);
    
    res.json({ 
      message: 'If the email exists, a reset link has been sent',
      mockResetLink: resetLink // Only for development
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Reset password with token
router.post('/reset-password', validate('resetPassword'), async (req, res) => {
  try {
    const { token, password } = req.body;

    // Check if reset token exists and is valid
    global.passwordResetTokens = global.passwordResetTokens || {};
    const resetData = global.passwordResetTokens[token];

    if (!resetData) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    if (new Date() > resetData.expiresAt) {
      delete global.passwordResetTokens[token];
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Update user password
    await User.updatePassword(resetData.userId, password);

    // Clean up reset token
    delete global.passwordResetTokens[token];

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router;
