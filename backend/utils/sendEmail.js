const nodemailer = require('nodemailer');
const Setting = require('../models/Setting');

const sendEmail = async ({ to, subject, html, attachments }) => {
  let host = process.env.SMTP_HOST;
  let port = parseInt(process.env.SMTP_PORT) || 587;
  let user = process.env.SMTP_USER;
  let pass = process.env.SMTP_PASS;
  let from = process.env.SMTP_FROM || 'no-reply@portfolio.com';
  let fromName = 'Portfolio';
  let encryption = 'tls'; // 'tls', 'ssl', 'none'

  try {
    const dbSettings = await Setting.findOne();
    if (dbSettings) {
      if (dbSettings.smtpHost) host = dbSettings.smtpHost;
      if (dbSettings.smtpPort) port = dbSettings.smtpPort;
      if (dbSettings.smtpUser) user = dbSettings.smtpUser;
      if (dbSettings.smtpPass) pass = dbSettings.smtpPass;
      if (dbSettings.smtpFrom) from = dbSettings.smtpFrom;
      if (dbSettings.smtpFromName) fromName = dbSettings.smtpFromName;
      if (dbSettings.smtpEncryption) encryption = dbSettings.smtpEncryption;
    }
  } catch (err) {
    console.error('Error loading SMTP settings from DB, using fallback environment variables:', err);
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: encryption === 'ssl', // true for port 465 SSL, false for TLS port 587 / non-secure
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false // avoids SSL/TLS verification issue in some server environments
    }
  });

  await transporter.sendMail({
    from: `"${fromName}" <${from}>`,
    to,
    subject,
    html,
    attachments: attachments || [],
  });
};

module.exports = sendEmail;

