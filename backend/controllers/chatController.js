const ChatMessage = require('../models/ChatMessage');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Service = require('../models/Service');
const Experience = require('../models/Experience');
const Certification = require('../models/Certification');
const ChatbotFaq = require('../models/ChatbotFaq');
const Setting = require('../models/Setting');
const { getOpenAIClient, createOpenAIMessage } = require('../utils/openaiClient');

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

const createLocalReply = async (input, profile) => {
  const clean = String(input).toLowerCase().trim();
  const has = (words) => words.some((word) => clean.includes(word));

  // 1. Check custom FAQs first
  try {
    const faqs = await ChatbotFaq.find();
    const matchedFaq = faqs.find(faq => {
      const qClean = faq.question.toLowerCase().trim();
      return clean.includes(qClean) || qClean.includes(clean);
    });
    if (matchedFaq) {
      return { content: matchedFaq.answer };
    }
  } catch (err) {
    console.error('Error fetching ChatbotFaqs:', err);
  }

  // Fetch chatbot settings for customizable fallback messages
  let settings = null;
  try {
    settings = await Setting.findOne();
  } catch (err) {
    console.error('Error loading Setting for chatbot fallbacks:', err);
  }

  const skillsText = settings?.fallbackSkills || 'Hardik works across the full MERN stack with strong frontend, backend, database, and tooling coverage.';
  const projectsText = settings?.fallbackProjects || 'Here are a few featured projects from the portfolio:';
  const servicesText = settings?.fallbackServices || 'Hardik can help with full stack web apps, API development, frontend implementation, database design, performance work, and technical consulting.';

  if (has(['skill', 'tech', 'stack', 'language', 'framework', 'tool'])) {
    const skills = await Skill.find().sort({ order: 1 }).limit(8);
    const grouped = skills.reduce((acc, skill) => {
      acc[skill.category] = acc[skill.category] || [];
      acc[skill.category].push(skill.name);
      return acc;
    }, {});

    return {
      content: [
        skillsText,
        ...Object.entries(grouped).map(([category, names]) => `${category}: ${names.join(', ')}`),
      ],
    };
  }

  if (has(['project', 'portfolio', 'built', 'work', 'app', 'demo'])) {
    const projects = await Project.find({ featured: true }).sort({ order: 1 }).limit(3);
    return {
      kind: 'cards',
      content: projectsText,
      cards: projects.map((project) => ({
        title: project.title,
        description: project.description,
        tags: project.technologies?.slice(0, 4).join(', '),
      })),
    };
  }

  if (has(['service', 'consult', 'build'])) {
    const services = await Service.find().sort({ order: 1 }).limit(4);
    return {
      content: [
        servicesText,
        `Common services: ${services.map((service) => service.title).join(', ')}.`,
      ],
    };
  }

  if (has(['experience', 'job', 'career', 'company', 'education', 'certification'])) {
    const experience = await Experience.find().sort({ order: 1 }).limit(3);
    const certifications = await Certification.find().sort({ date: -1 }).limit(4);
    return {
      content: [
        `Experience: ${experience.map((item) => `${item.title} at ${item.company}`).join('; ')}.`,
        `Certifications include: ${certifications.map((cert) => cert.title).join(', ')}.`,
      ],
    };
  }

  if (has(['contact', 'email', 'phone', 'linkedin', 'github', 'social'])) {
    return {
      content: [
        `Email: ${profile.email}`,
        `Phone: ${profile.phone}`,
        `Location: ${profile.location}`,
        'You can also send a message from this chat and it will go into the portfolio contact system.',
      ],
    };
  }

  return {
    content: [
      "I can help visitors quickly understand Hardik's portfolio.",
      'Try asking about skills, featured projects, experience, services, or contact details.',
    ],
  };
};

const buildOpenAIMessages = async (sessionId, input, profile) => {
  const history = sessionId
    ? await ChatMessage.find({ sessionId }).sort({ createdAt: 1 }).lean().limit(50)
    : [];

  const systemText = `You are Hardik's portfolio assistant. Answer questions helpfully and concisely using the portfolio context. If the visitor asks about skills, projects, experience, services, contact, or hiring, provide clear guidance and mention Hardik's strengths in React, Node.js, MongoDB, and full-stack web development. Do not invent personal details outside the given portfolio information.`;

  const portfolioSummary = [
    profile.name ? `Name: ${profile.name}` : null,
    profile.title ? `Title: ${profile.title}` : null,
    profile.email ? `Email: ${profile.email}` : null,
    profile.phone ? `Phone: ${profile.phone}` : null,
    profile.location ? `Location: ${profile.location}` : null,
    profile.bio ? `Bio: ${profile.bio}` : null,
  ].filter(Boolean).join('\n');

  const messages = [
    { role: 'system', content: systemText },
  ];

  if (portfolioSummary) {
    messages.push({ role: 'system', content: `Portfolio context:\n${portfolioSummary}` });
  }

  history.forEach((message) => {
    const role = message.from === 'user' ? 'user' : 'assistant';
    messages.push({ role, content: String(message.content) });
  });

  messages.push({ role: 'user', content: String(input) });
  return messages;
};

const getOpenAIReply = async (sessionId, input, profile) => {
  const client = getOpenAIClient();
  if (!client) return null;

  try {
    const messages = await buildOpenAIMessages(sessionId, input, profile);
    const completion = await client.createChatCompletion({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.6,
      max_tokens: 500,
    });

    const response = completion?.data?.choices?.[0]?.message?.content;
    if (!response) return null;

    return { content: response.trim() };
  } catch (error) {
    console.error('OpenAI chat error:', error.message || error);
    return null;
  }
};

exports.postChat = async (req, res, next) => {
  try {
    const { input, sessionId } = req.body;
    if (!input) return res.status(400).json({ message: 'input is required' });
    if (!sessionId) return res.status(400).json({ message: 'sessionId is required' });

    const profile = await Profile.findOne();
    const profileData = profile || {};

    let reply = await getOpenAIReply(sessionId, input, profileData);
    if (!reply) {
      reply = await createLocalReply(input, profileData);
    }

    await ChatMessage.create({ sessionId, from: 'user', content: input });
    await ChatMessage.create({ sessionId, from: 'bot', content: reply.content, kind: reply.kind || 'text', meta: reply.meta || {} });

    res.json({ reply });
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ message: 'sessionId is required' });
    const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 });
    res.json(messages.map((message) => ({
      id: message._id,
      from: message.from,
      sender: message.from,
      content: message.content,
      time: message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      kind: message.kind,
    })));
  } catch (error) {
    next(error);
  }
};

exports.saveHistory = async (req, res, next) => {
  try {
    const { sessionId, messages } = req.body;
    if (!sessionId || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'sessionId and messages are required' });
    }

    const docs = messages.map((m) => ({
      sessionId,
      from: m.sender === 'user' ? 'user' : 'bot',
      content: m.content,
      kind: m.kind || 'text',
      meta: m.meta || {},
    }));

    await ChatMessage.insertMany(docs);
    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};
