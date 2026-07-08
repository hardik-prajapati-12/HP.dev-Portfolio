const Service = require('../models/Service');

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const validateServiceData = async (data) => {
  const { title, desc, icon, subtitle, techStack, impact } = data;

  if (!title || title.trim().length === 0) {
    return 'Service Title is required';
  }
  if (title.trim().length > 100) {
    return 'Service Title cannot exceed 100 characters';
  }

  if (!desc || desc.trim().length === 0) {
    return 'Description is required';
  }
  if (desc.trim().length > 500) {
    return 'Description cannot exceed 500 characters';
  }

  if (icon) {
    if (!/^\p{Extended_Pictographic}$/u.test(icon)) {
      return 'Icon must be exactly one emoji';
    }
  }

  if (subtitle && subtitle.trim().length > 100) {
    return 'Subtitle / Tagline cannot exceed 100 characters';
  }

  return null;
};

const processServiceDetails = (body) => {
  const processed = { ...body };

  if (processed.techStack !== undefined) {
    if (typeof processed.techStack === 'string') {
      processed.techStack = processed.techStack
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    } else if (Array.isArray(processed.techStack)) {
      processed.techStack = processed.techStack
        .map(item => String(item).trim())
        .filter(item => item.length > 0);
    }
  }

  if (processed.pillars !== undefined) {
    if (typeof processed.pillars === 'string') {
      processed.pillars = processed.pillars
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    } else if (Array.isArray(processed.pillars)) {
      processed.pillars = processed.pillars
        .map(item => String(item).trim())
        .filter(item => item.length > 0);
    }
  }

  if (processed.workflow !== undefined) {
    if (typeof processed.workflow === 'string') {
      processed.workflow = processed.workflow
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    } else if (Array.isArray(processed.workflow)) {
      processed.workflow = processed.workflow
        .map(item => String(item).trim())
        .filter(item => item.length > 0);
    }
  }

  return processed;
};

exports.createService = async (req, res) => {
  try {
    const processedBody = processServiceDetails(req.body);
    const validationError = await validateServiceData(processedBody);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const service = await Service.create(processedBody);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: 'Error creating service', error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const processedBody = processServiceDetails(req.body);
    const validationError = await validateServiceData(processedBody);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const service = await Service.findByIdAndUpdate(req.params.id, processedBody, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: 'Error updating service', error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};
