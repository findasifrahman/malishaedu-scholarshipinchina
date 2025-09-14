const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Check if we should use mock mode (for development)
    const useMockMode = !process.env.EMAIL_HOST || 
                       !process.env.EMAIL_USER || 
                       !process.env.EMAIL_PASS ||
                       process.env.EMAIL_USER === 'your-email@gmail.com' ||
                       process.env.EMAIL_PASS === 'your-app-password';

    if (useMockMode) {
      this.transporter = null;
      console.warn('Email service using mock mode. Please configure SMTP settings in .env file.');
      console.warn('Required environment variables: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM');
    } else {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,   // 10 seconds
        socketTimeout: 10000,     // 10 seconds
        tls: {
          rejectUnauthorized: false // For development/testing
        }
      });
      console.log('Email service configured for SMTP use.');
    }
  }

  async sendVerificationCode(email, code) {
    if (!this.transporter) {
      console.log(`Mock email verification code for ${email}: ${code}`);
      return { success: false, error: 'Email service not configured' };
    }
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Email sending timeout')), 15000); // 15 seconds
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'MalishaEdu - Email Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #068b76; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">MalishaEdu</h1>
              <p style="margin: 10px 0 0 0;">Global Scholarship Platform</p>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
              <p style="color: #666; line-height: 1.6;">
                Thank you for registering with MalishaEdu! To complete your registration, 
                please use the verification code below:
              </p>
              <div style="background-color: white; border: 2px solid #068b76; border-radius: 8px; 
                          padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #068b76; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
              </div>
              <p style="color: #666; font-size: 14px;">
                This code will expire in 2 minutes. If you didn't request this code, 
                please ignore this email.
              </p>
            </div>
            <div style="background-color: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
              <p>© 2024 MalishaEdu. All rights reserved.</p>
            </div>
          </div>
        `,
      };

      console.log(`Attempting to send verification email to: ${email}`);
      const sendPromise = this.transporter.sendMail(mailOptions);
      const result = await Promise.race([sendPromise, timeoutPromise]);
      
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending email:', error.message);
      console.error('Full error:', error);
      
      // Log the verification code for debugging
      console.log(`Email sending failed. Verification code for ${email}: ${code}`);
      
      return { 
        success: false, 
        error: error.message || 'Failed to send email',
        mockCode: code // Include code for debugging
      };
    }
  }

  async testConnection() {
    if (!this.transporter) {
      console.log('Email service not configured');
      return false;
    }
    
    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
