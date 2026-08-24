import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Support larger payload for PDF/document base64 uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Helper to get Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instruction for resume parsing
const RESUME_PARSER_INSTRUCTION = `You are an expert HR and Technical Resume Parser. 
Extract structured candidate profile information from the provided resume document or text.
Ensure accuracy and extract as much relevant information as possible:
- Extract candidate's full name, phone number, email, GitHub profile URL, LinkedIn profile URL, current location, target/preferred role, and a polished professional summary (bio).
- Extract education details: university/school name, school location, degree/course title, and graduation year or range.
- Extract all technical and soft skills, both as a flat list and logically categorized (e.g. Web Development, IT Support & Systems, Developer & IT Tools, Databases, Cloud & DevOps, Soft Skills, etc.).
- Extract work experience & internships: role title, company name, location, time period / duration, and detailed bullet points of contributions.
- Extract student/research/portfolio projects: title, subtitle/association, brief description, technologies/stack used, and key accomplishments/highlights.

If any field is not found in the resume, provide an empty string or empty array. Output must be strictly structured according to the requested JSON schema.`;

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Resume parsing endpoint
app.post('/api/resume/parse', async (req, res) => {
  try {
    const { text, fileData, mimeType } = req.body;

    if (!text && !fileData) {
      return res.status(400).json({ error: 'Please provide resume text or a file upload.' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // If API key is not configured, parse basic text fields using simple extraction
      const fallbackResult = parseTextBasic(text || '');
      return res.json({
        success: true,
        data: fallbackResult,
        warning: 'Parsed with local heuristic fallback. Add GEMINI_API_KEY in Secrets for deep AI parsing.',
      });
    }

    let contents: any;

    if (fileData && mimeType) {
      // Base64 file provided (PDF, image, etc.)
      const cleanedBase64 = fileData.includes('base64,') ? fileData.split('base64,')[1] : fileData;
      const filePart = {
        inlineData: {
          data: cleanedBase64,
          mimeType: mimeType || 'application/pdf',
        },
      };

      const promptPart = {
        text: text
          ? `Please parse this resume document and the additional accompanying text:\n\n${text}`
          : `Please parse this uploaded resume document and extract complete profile data.`,
      };

      contents = { parts: [filePart, promptPart] };
    } else {
      // Plain text provided
      contents = `Please parse the following resume text:\n\n${text}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction: RESUME_PARSER_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Candidate's full name" },
            phone: { type: Type.STRING, description: 'Phone or mobile number' },
            email: { type: Type.STRING, description: 'Email address' },
            githubUrl: { type: Type.STRING, description: 'GitHub profile URL' },
            linkedinUrl: { type: Type.STRING, description: 'LinkedIn profile URL' },
            location: { type: Type.STRING, description: 'City/Region/Country of residence' },
            preferredRole: { type: Type.STRING, description: 'Target or current professional title' },
            school: { type: Type.STRING, description: 'University or College institution name' },
            schoolLocation: { type: Type.STRING, description: 'Location of university/college' },
            course: { type: Type.STRING, description: 'Degree or course program' },
            graduationYear: { type: Type.STRING, description: 'Graduation year or date range' },
            bio: { type: Type.STRING, description: 'Professional summary or objective' },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Flat list of all skills mentioned',
            },
            skillCategories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: 'Category title, e.g. Web Development' },
                  skills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Skills in this category',
                  },
                },
                required: ['category', 'skills'],
              },
              description: 'Grouped categories of technical and soft skills',
            },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: 'Unique identifier e.g. exp-1' },
                  role: { type: Type.STRING, description: 'Job title / Position' },
                  company: { type: Type.STRING, description: 'Company / Organization' },
                  location: { type: Type.STRING, description: 'Job location' },
                  period: { type: Type.STRING, description: 'Duration or date range' },
                  details: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Bullet points of responsibilities and achievements',
                  },
                },
                required: ['role', 'company'],
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: 'Unique identifier e.g. proj-1' },
                  title: { type: Type.STRING, description: 'Project name' },
                  subtitle: { type: Type.STRING, description: 'Project category or affiliation' },
                  description: { type: Type.STRING, description: 'Brief description of project' },
                  techStack: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Tech stack used in project',
                  },
                  highlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Accomplishments or features developed',
                  },
                },
                required: ['title', 'description'],
              },
            },
          },
          required: ['name', 'skills'],
        },
      },
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error('No data returned from AI resume parser.');
    }

    const parsedData = JSON.parse(responseText);
    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Resume parsing error:', error);
    // If Gemini parsing fails, try fallback
    const fallback = parseTextBasic(req.body.text || '');
    return res.status(200).json({
      success: true,
      data: fallback,
      warning: error?.message || 'Parsed using basic text extraction due to AI service timeout.',
    });
  }
});

// Basic heuristic text parser fallback
function parseTextBasic(text: string) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
  const githubMatch = text.match(/https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/);
  const linkedinMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/);

  const name = lines[0] || 'Applicant';

  return {
    name,
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    githubUrl: githubMatch ? githubMatch[0] : '',
    linkedinUrl: linkedinMatch ? linkedinMatch[0] : '',
    location: 'Philippines',
    preferredRole: 'IT / Software Developer',
    school: '',
    schoolLocation: '',
    course: '',
    graduationYear: '',
    bio: text.slice(0, 300),
    skills: ['JavaScript', 'HTML5', 'CSS3', 'PHP', 'MySQL', 'Git'],
    skillCategories: [
      { category: 'Technical Skills', skills: ['JavaScript', 'HTML5', 'CSS3', 'PHP', 'MySQL', 'Git'] },
    ],
    experiences: [],
    projects: [],
  };
}

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JobTracker server listening on port ${PORT}`);
  });
}

startServer();
