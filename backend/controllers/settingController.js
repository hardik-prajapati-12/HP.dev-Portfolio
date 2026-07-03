const Setting = require('../models/Setting');
const nodemailer = require('nodemailer');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error loading settings', error: error.message });
  }
};

exports.getPublicSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json({
      siteTitle: settings.siteTitle || 'HP.dev',
      siteLogoText: settings.siteLogoText || 'HP.dev',
      maintenanceMode: settings.maintenanceMode || false,
      googleAnalyticsId: settings.googleAnalyticsId || '',
      enableVisitorLogging: settings.enableVisitorLogging !== false,
      visibleSections: settings.visibleSections || {
        about: true,
        skills: true,
        projects: true,
        experience: true,
        services: true,
        certifications: true,
        blog: true,
        testimonials: true,
        contact: true
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error loading public settings', error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await Setting.findOneAndUpdate({}, req.body, { new: true, upsert: true, runValidators: true });
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: 'Error updating settings', error: error.message });
  }
};

exports.testSmtpConnection = async (req, res, next) => {
  try {
    const { smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom, smtpFromName, smtpEncryption } = req.body;
    
    if (!smtpHost || !smtpUser || !smtpPass) {
      return res.status(400).json({ message: 'SMTP Host, Username, and Password are required to test connection.' });
    }

    const port = parseInt(smtpPort) || 587;
    const secure = smtpEncryption === 'ssl'; // SSL is port 465 secure connection

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port,
      secure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 5000 // 5 seconds timeout
    });

    await transporter.verify();
    res.json({ success: true, message: 'SMTP Connection tested successfully! Credentials are valid.' });
  } catch (error) {
    res.status(500).json({ message: 'SMTP Connection failed: ' + error.message });
  }
};

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

exports.getSystemInfo = async (req, res, next) => {
  try {
    const uploadsPath = path.join(__dirname, '../uploads');
    let uploadsWritable = false;
    try {
      if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath, { recursive: true });
      }
      fs.accessSync(uploadsPath, fs.constants.W_OK);
      uploadsWritable = true;
    } catch (err) {
      uploadsWritable = false;
    }

    const dbState = mongoose.connection.readyState;
    let dbStatus = 'DISCONNECTED';
    if (dbState === 1) dbStatus = 'CONNECTED';
    else if (dbState === 2) dbStatus = 'CONNECTING';
    else if (dbState === 3) dbStatus = 'DISCONNECTING';

    const nodeVersion = process.version;
    const serverPlatform = process.platform;
    const mongooseVersion = mongoose.version;

    res.json({
      nodeVersion,
      server: `Express / Node.js (${serverPlatform})`,
      database: `MongoDB (Mongoose v${mongooseVersion})`,
      databaseStatus: dbStatus,
      uploadsFolder: uploadsWritable ? 'WRITABLE' : 'NOT WRITABLE',
      sessions: 'ACTIVE'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving system info', error: error.message });
  }
};


