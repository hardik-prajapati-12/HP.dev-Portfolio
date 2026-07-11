const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Run experience types migration
    await migrateExperienceTypes();

    // Run blog categories migration
    await migrateBlogCategories();

    // Migrate old published boolean to new status field
    await migrateBlogStatus();

    // Migrate blog tags to lowercase
    await migrateBlogTagsToLowercase();

    // Start the blog scheduler for auto-publishing scheduled posts
    startBlogScheduler();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const migrateExperienceTypes = async () => {
  try {
    const ExperienceType = require('../models/ExperienceType');
    const Experience = require('../models/Experience');

    // 1. If ExperienceType is empty, seed it with default types
    const count = await ExperienceType.countDocuments();
    const defaultTypes = ['Full-time', 'Internship', 'Freelance', 'Volunteer', 'Part-time', 'Contract'];
    
    if (count === 0) {
      console.log('Seeding default experience types...');
      await ExperienceType.insertMany(defaultTypes.map(name => ({ name })));
      console.log('Default experience types seeded.');
    }

    // 2. Migrate lowercase experience types to capitalized ones in the Experience collection
    const mapping = {
      'full-time': 'Full-time',
      'internship': 'Internship',
      'freelance': 'Freelance',
      'volunteer': 'Volunteer',
      'part-time': 'Part-time',
      'contract': 'Contract'
    };

    for (const [lower, cap] of Object.entries(mapping)) {
      const result = await Experience.updateMany({ type: lower }, { type: cap });
      if (result.modifiedCount > 0) {
        console.log(`Migrated ${result.modifiedCount} experiences from type "${lower}" to "${cap}"`);
      }
    }
  } catch (err) {
    console.error('Error during ExperienceType migration:', err.message);
  }
};

const migrateBlogCategories = async () => {
  try {
    const BlogCategory = require('../models/BlogCategory');
    const Blog = require('../models/Blog');

    // 1. If BlogCategory is empty, seed it with default categories
    const count = await BlogCategory.countDocuments();
    const defaultCategories = [
      { name: 'Frontend', color: '#3B82F6' },
      { name: 'Backend', color: '#10B981' },
      { name: 'Design', color: '#EC4899' }
    ];
    
    if (count === 0) {
      console.log('Seeding default blog categories...');
      await BlogCategory.insertMany(defaultCategories);
      console.log('Default blog categories seeded.');
    }

    // 2. Migrate lowercase categories to capitalized ones in the Blog collection, and sync category colors
    const mapping = {
      'frontend': { name: 'Frontend', color: '#3B82F6' },
      'backend': { name: 'Backend', color: '#10B981' },
      'design': { name: 'Design', color: '#EC4899' }
    };

    for (const [lower, info] of Object.entries(mapping)) {
      const result = await Blog.updateMany(
        { category: lower }, 
        { category: info.name, categoryColor: info.color }
      );
      if (result.modifiedCount > 0) {
        console.log(`Migrated ${result.modifiedCount} blogs from category "${lower}" to "${info.name}"`);
      }
    }
  } catch (err) {
    console.error('Error during BlogCategory migration:', err.message);
  }
};

// ── Migrate old published boolean to new status enum ──
const migrateBlogStatus = async () => {
  try {
    const Blog = require('../models/Blog');

    // Convert published: true (without status) → status: 'published'
    const publishedResult = await Blog.updateMany(
      { published: true, status: { $exists: false } },
      { $set: { status: 'published' }, $unset: { published: '' } }
    );
    if (publishedResult.modifiedCount > 0) {
      console.log(`Migrated ${publishedResult.modifiedCount} blogs from published:true → status:published`);
    }

    // Convert published: false (without status) → status: 'draft'
    const draftResult = await Blog.updateMany(
      { published: false, status: { $exists: false } },
      { $set: { status: 'draft' }, $unset: { published: '' } }
    );
    if (draftResult.modifiedCount > 0) {
      console.log(`Migrated ${draftResult.modifiedCount} blogs from published:false → status:draft`);
    }

    // Also handle documents that have published field alongside the new status field
    const legacyCleanup = await Blog.updateMany(
      { published: { $exists: true }, status: { $exists: true } },
      { $unset: { published: '' } }
    );
    if (legacyCleanup.modifiedCount > 0) {
      console.log(`Cleaned up legacy published field from ${legacyCleanup.modifiedCount} blogs`);
    }
  } catch (err) {
    console.error('Error during blog status migration:', err.message);
  }
};

// ── Blog Scheduler: Auto-publish scheduled posts when their time arrives ──
let schedulerInterval = null;

const publishScheduledBlogs = async () => {
  try {
    const Blog = require('../models/Blog');
    const now = new Date();

    const result = await Blog.updateMany(
      {
        status: 'scheduled',
        scheduledAt: { $lte: now }
      },
      {
        $set: { status: 'published' }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`[Blog Scheduler] Auto-published ${result.modifiedCount} scheduled blog(s) at ${now.toISOString()}`);
    }
  } catch (err) {
    console.error('[Blog Scheduler] Error:', err.message);
  }
};

const startBlogScheduler = () => {
  // Run immediately on startup to catch any posts that should have been published
  publishScheduledBlogs();

  // Then run every 60 seconds
  schedulerInterval = setInterval(publishScheduledBlogs, 60 * 1000);
  console.log('[Blog Scheduler] Started — checking every 60 seconds for scheduled posts');
};

const migrateBlogTagsToLowercase = async () => {
  try {
    const Tag = require('../models/Tag');
    const Blog = require('../models/Blog');

    // 1. Convert all tags in Tag collection to lowercase
    const tags = await Tag.find();
    for (const tag of tags) {
      const lower = tag.name.toLowerCase();
      if (tag.name !== lower) {
        // Check if there is already a tag with the lowercase name
        const duplicate = await Tag.findOne({ name: lower });
        if (duplicate) {
          await Tag.deleteOne({ _id: tag._id });
        } else {
          tag.name = lower;
          await tag.save();
        }
      }
    }

    // 2. Convert all tags inside Blog posts to lowercase
    const blogs = await Blog.find();
    for (const blog of blogs) {
      if (blog.tags && blog.tags.length > 0) {
        const lowerTags = blog.tags.map(t => t.toLowerCase());
        const hasChanges = blog.tags.some((t, i) => t !== lowerTags[i]);
        if (hasChanges) {
          // Remove duplicates
          blog.tags = [...new Set(lowerTags)];
          await blog.save();
        }
      }
    }
    console.log('Blog tags lowercase migration completed.');
  } catch (err) {
    console.error('Error during Blog tags lowercase migration:', err.message);
  }
};

module.exports = connectDB;
