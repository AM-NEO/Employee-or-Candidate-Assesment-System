import nodemailer from 'nodemailer';
import { Candidate } from './inMemoryDB';
import { TIER_DEFINITIONS } from './tiering';

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  // For development, you can use a service like Ethereal Email
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendTierResultEmail(candidate: Candidate) {
  const tierInfo = TIER_DEFINITIONS[candidate.tier];
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Dessishub Skills Assessment Results</h1>
      
      <p>Dear ${candidate.name},</p>
      
      <p>Thank you for completing our skills assessment. Based on your responses, you have been assigned to:</p>
      
      <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1d4ed8; margin: 0 0 10px 0;">Tier ${candidate.tier}</h2>
        <h3 style="color: #374151; margin: 0 0 10px 0;">${tierInfo.title}</h3>
        <p style="color: #6b7280; margin: 0;">${tierInfo.description}</p>
      </div>
      
      <h3>Your Skills Summary:</h3>
      <ul>
        <li>HTML, CSS, JavaScript: ${candidate.knowsHtmlCssJs ? '✅' : '❌'}</li>
        <li>React/Next.js: ${candidate.knowsReactNext ? '✅' : '❌'}</li>
        <li>CRUD Applications: ${candidate.canBuildCrud ? '✅' : '❌'}</li>
        <li>Authentication: ${candidate.canBuildAuth ? '✅' : '❌'}</li>
        <li>Backend Frameworks: ${candidate.knowsBackendFrameworks ? '✅' : '❌'}</li>
        <li>Golang: ${candidate.knowsGolang ? '✅' : '❌'}</li>
        <li>Cloud Infrastructure: ${candidate.knowsCloudInfra ? '✅' : '❌'}</li>
        <li>System Design: ${candidate.knowsSystemDesign ? '✅' : '❌'}</li>
      </ul>
      
      <p>We will be in touch soon with next steps based on your tier assignment.</p>
      
      <p>Best regards,<br>The Dessishub Team</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px;">
        This email was sent automatically. Please do not reply to this email.
      </p>
    </div>
  `;

  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@dessishub.com',
    to: candidate.email,
    subject: `Your Dessishub Skills Assessment Results - Tier ${candidate.tier}`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}