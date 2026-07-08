const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Education = require('./models/Education');
const User = require('./models/User');
const Stat = require('./models/Stat');

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB:', process.env.MONGODB_URI);
    
    const educations = await Education.find();
    console.log('Educations in DB:', educations.length);
    educations.forEach(e => console.log(`- ${e.degree} at ${e.institution} (${e.year})`));

    const users = await User.find();
    console.log('Users in DB:', users.length);
    users.forEach(u => console.log(`- ${u.name} (${u.email}) - ${u._id}`));

    const stats = await Stat.find();
    console.log('Stats in DB:', stats.length);
    stats.forEach(s => console.log(`- ${s.label}: ${s.value}`));

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

check();
