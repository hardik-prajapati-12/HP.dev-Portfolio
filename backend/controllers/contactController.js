const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// POST /api/contact
exports.submitContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);

    // Try to send email notification (don't fail if SMTP not configured)
    try {
      await sendEmail({
        to: process.env.SMTP_FROM,
        subject: `Portfolio Contact: ${req.body.subject}`,
        html: `
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${req.body.name}</p>
          <p><strong>Email:</strong> ${req.body.email}</p>
          <p><strong>Subject:</strong> ${req.body.subject}</p>
          <p><strong>Message:</strong> ${req.body.message}</p>
        `,
      });
    } catch (emailErr) {
      console.log('Email notification failed (SMTP may not be configured):', emailErr.message);
    }

    res.status(201).json({ success: true, message: 'Message sent successfully!', contact });
  } catch (error) {
    next(error);
  }
};

// GET /api/contact (admin)
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

// PUT /api/contact/:id/read
exports.markAsRead = async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/contact/:id
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// POST /api/contact/:id/reply
exports.replyMessage = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required' });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Send email reply using SMTP settings
    await sendEmail({
      to: contact.email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 0.9em;">
            <strong>Original Message:</strong><br>
            <strong>From:</strong> ${contact.name} (${contact.email})<br>
            <strong>Subject:</strong> ${contact.subject}<br>
            <strong>Date:</strong> ${new Date(contact.createdAt).toLocaleString()}<br><br>
            ${contact.message.replace(/\n/g, '<br>')}
          </p>
        </div>
      `
    });

    // Mark as read and replied
    contact.read = true;
    contact.replied = true;
    contact.replySubject = subject;
    contact.replyMessage = message;
    contact.repliedAt = new Date();
    await contact.save();

    res.json({ success: true, message: 'Reply sent successfully!', data: contact });
  } catch (error) {
    next(error);
  }
};


