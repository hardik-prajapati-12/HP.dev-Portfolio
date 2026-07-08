const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Skill = require('../models/Skill');

const learningSkills = [
  { name: "Rust", level: 100, category: "Learning", order: 24 },
  { name: "TypeScript", level: 100, category: "Learning", order: 25 },
  { name: "Kubernetes", level: 100, category: "Learning", order: 26 },
  { name: "AI/ML", level: 100, category: "Learning", order: 27 },
  { name: "React Native", level: 100, category: "Learning", order: 28 },
  { name: "Web3", level: 100, category: "Learning", order: 29 },
];

async function runMigration() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Migrating "Always Learning" skills...');
    for (const skillData of learningSkills) {
      const existing = await Skill.findOne({ name: skillData.name, category: 'Learning' });
      if (!existing) {
        // Also check if it exists in another category to avoid double migration
        const existsAnywhere = await Skill.findOne({ name: skillData.name });
        if (existsAnywhere) {
          console.log(`Skill "${skillData.name}" already exists in category "${existsAnywhere.category}". Updating it to "Learning"...`);
          existsAnywhere.category = 'Learning';
          existsAnywhere.order = skillData.order;
          await existsAnywhere.save();
        } else {
          await Skill.create(skillData);
          console.log(`Created skill "${skillData.name}" in "Learning" category.`);
        }
      } else {
        console.log(`Skill "${skillData.name}" already exists in "Learning" category.`);
      }
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
