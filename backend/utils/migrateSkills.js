const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Skill = require('../models/Skill');

async function runMigration() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Check if HTML/CSS exists
    const htmlCssSkill = await Skill.findOne({ name: 'HTML/CSS' });
    if (htmlCssSkill) {
      console.log('Found "HTML/CSS" skill. Splitting into "HTML" and "CSS"...');
      
      // Update HTML/CSS to HTML
      htmlCssSkill.name = 'HTML';
      htmlCssSkill.order = 5;
      await htmlCssSkill.save();
      console.log('Updated "HTML/CSS" to "HTML"');

      // Create new CSS skill
      const cssSkill = new Skill({
        name: 'CSS',
        category: 'Frontend',
        level: 93,
        order: 6,
        image: ''
      });
      await cssSkill.save();
      console.log('Created new "CSS" skill at order 6');

      // Shift subsequent skills
      // Find all skills (except the new CSS skill) that have order >= 6
      const skillsToShift = await Skill.find({
        _id: { $ne: cssSkill._id },
        name: { $ne: 'HTML' }, // Make sure we don't touch HTML at order 5
        order: { $gte: 6 }
      });

      console.log(`Shifting orders of ${skillsToShift.length} skills...`);
      for (const skill of skillsToShift) {
        skill.order += 1;
        await skill.save();
      }
      console.log('Database skills updated successfully.');
    } else {
      console.log('"HTML/CSS" skill not found. Checking if HTML and CSS already exist...');
      const htmlExists = await Skill.findOne({ name: 'HTML' });
      const cssExists = await Skill.findOne({ name: 'CSS' });
      if (!htmlExists) {
        console.log('HTML skill not found, creating it...');
        await Skill.create({
          name: 'HTML',
          category: 'Frontend',
          level: 95,
          order: 5,
          image: ''
        });
      } else {
        htmlExists.order = 5;
        await htmlExists.save();
      }
      if (!cssExists) {
        console.log('CSS skill not found, creating it...');
        await Skill.create({
          name: 'CSS',
          category: 'Frontend',
          level: 93,
          order: 6,
          image: ''
        });
      } else {
        cssExists.order = 6;
        await cssExists.save();
      }
      console.log('Done.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
