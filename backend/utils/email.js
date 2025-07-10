const nodemailer = require('nodemailer');

/**
 * Send email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message (HTML)
 */
exports.sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Define email options
  const mailOptions = {
    from: `EventHarmony <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    html: options.message
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

/**
 * Generate email template
 * @param {Object} options - Template options
 * @param {string} options.title - Email title
 * @param {string} options.name - Recipient name
 * @param {string} options.message - Email message
 * @param {string} options.buttonText - Button text
 * @param {string} options.buttonUrl - Button URL
 * @param {string} options.footerText - Footer text
 * @returns {string} - HTML email template
 */
exports.generateEmailTemplate = (options) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${options.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4a6cf7;
          color: #fff;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
        }
        .button {
          display: inline-block;
          background-color: #4a6cf7;
          color: #fff;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${options.title}</h1>
        </div>
        <div class="content">
          <p>Hello${options.name ? ' ' + options.name : ''},</p>
          <p>${options.message}</p>
          ${options.buttonText && options.buttonUrl ? `
            <a href="${options.buttonUrl}" class="button">${options.buttonText}</a>
          ` : ''}
        </div>
        <div class="footer">
          <p>${options.footerText || '© ' + new Date().getFullYear() + ' EventHarmony. All rights reserved.'}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};