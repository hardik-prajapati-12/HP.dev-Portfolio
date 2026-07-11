const Profile = require('../models/Profile');

exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Return empty profile structure if none exists
      return res.json(null);
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.name && payload.name.length > 50) {
      return res.status(400).json({ message: 'Full Name cannot exceed 50 characters' });
    }
    if (payload.title && payload.title.length > 50) {
      return res.status(400).json({ message: 'Job Title cannot exceed 50 characters' });
    }
    if (payload.email && payload.email.length > 100) {
      return res.status(400).json({ message: 'Email cannot exceed 100 characters' });
    }
    if (payload.location && payload.location.length > 50) {
      return res.status(400).json({ message: 'Location cannot exceed 50 characters' });
    }
    if (payload.yearsExp !== undefined && payload.yearsExp !== '' && payload.yearsExp !== null) {
      if (isNaN(Number(payload.yearsExp)) || !/^\d{1,3}$/.test(String(payload.yearsExp).trim())) {
        return res.status(400).json({ message: 'Years of Experience must be a number up to 3 digits' });
      }
    }
    if (payload.phone && !/^\+\d+\s\d{10}$/.test(payload.phone)) {
      return res.status(400).json({ message: 'Phone number must have a valid country code and exactly 10 digits' });
    }
    if (payload.bio && payload.bio.length > 500) {
      return res.status(400).json({ message: 'Bio cannot exceed 500 characters' });
    }
    if (payload.heroTitle && payload.heroTitle.length > 100) {
      return res.status(400).json({ message: 'Sub Hero Title cannot exceed 100 characters' });
    }
    if (payload.heroDesc && payload.heroDesc.length > 300) {
      return res.status(400).json({ message: 'Hero Description cannot exceed 300 characters' });
    }
    if (payload.laptopName && payload.laptopName.length > 50) {
      return res.status(400).json({ message: 'Laptop Screen Name cannot exceed 50 characters' });
    }
    if (payload.laptopTitle && payload.laptopTitle.length > 50) {
      return res.status(400).json({ message: 'Laptop Screen Title cannot exceed 50 characters' });
    }
    if (payload.laptopPassion && payload.laptopPassion.length > 100) {
      return res.status(400).json({ message: 'Laptop Screen Passion cannot exceed 100 characters' });
    }
    if (typeof payload.laptopSkills === 'string') {
      if (payload.laptopSkills.length > 200) {
        return res.status(400).json({ message: 'Laptop skills cannot exceed 200 characters' });
      }
      payload.laptopSkills = payload.laptopSkills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (typeof payload.roles === 'string') {
      if (payload.roles.length > 200) {
        return res.status(400).json({ message: 'Roles cannot exceed 200 characters' });
      }
      payload.roles = payload.roles.split(',').map(r => r.trim()).filter(Boolean);
    }
    let profile = await Profile.findOne();
    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, payload, { new: true, runValidators: true });
    } else {
      profile = await Profile.create(payload);
    }

    if (req.user && payload.avatar !== undefined) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user._id, { avatar: payload.avatar });
    }

    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile', error: error.message });
  }
};
