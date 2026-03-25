import Groq from 'groq-sdk';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error('GROQ_API_KEY not found in .env.local');
  process.exit(1);
}

const groq = new Groq({ apiKey: GROQ_API_KEY });

async function testGroqAnalysis() {
  console.log('--- Testing Groq AI Resume Analysis ---');
  
  const resumeText = fs.readFileSync('mock-resume.txt', 'utf8');
  
  const prompt = `
    Analyze the provided resume and extract structured information.
    Return the result in ONLY valid JSON format with the following keys:
    - skills: Array of top 10 technical and professional skills.
    - roles: Array of 5 suggested job roles.
    - strengths: Array of 3-5 key professional strengths.
    - gaps: Array of 3 key missing skills or areas for improvement.
    - summary: A brief 2-sentence professional summary.
    - location: Candidate's current city and country (if found, otherwise "Not Specified").
    - experience: Estimated total years of professional work experience. If the candidate has no professional experience or is a student/recent graduate with no jobs, set this value to exactly "Fresher".

    RESUME TEXT:
    """
    ${resumeText}
    """

    Respond ONLY with a valid JSON object.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You output strict, raw JSON only. You are a robotic ATS parser.' },
        { role: 'user', content: prompt },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || '{}';
    const analysis = JSON.parse(responseContent);
    
    console.log('SUCCESS! Analysis Result:');
    console.log(JSON.stringify(analysis, null, 2));
  } catch (err) {
    console.error('FAILED to analyze resume:', err);
  }
}

testGroqAnalysis();
