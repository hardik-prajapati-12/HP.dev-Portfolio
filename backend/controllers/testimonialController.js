const Testimonial = require('../models/Testimonial');

const validateTestimonialData = (data) => {
  const { name, role, company, content } = data;

  if (name && name.trim().length > 100) {
    return 'Client Name cannot exceed 100 characters';
  }

  if (role && role.trim().length > 50) {
    return 'Role cannot exceed 50 characters';
  }

  if (company && company.trim().length > 100) {
    return 'Company cannot exceed 100 characters';
  }

  if (content && content.trim().length > 300) {
    return 'Content cannot exceed 300 characters';
  }

  return null;
};

exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

exports.createTestimonial = async (req, res, next) => {
  try {
    const validationError = validateTestimonialData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (error) {
    next(error);
  }
};

exports.updateTestimonial = async (req, res, next) => {
  try {
    const validationError = validateTestimonialData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json(testimonial);
  } catch (error) {
    next(error);
  }
};

exports.deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
};
