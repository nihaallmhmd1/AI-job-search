'use server'

import { createClient } from '@/lib/supabase/server'
import Groq from 'groq-sdk'
import PDFParser from 'pdf2json'
import mammoth from 'mammoth'

// Forcing a fresh initialization
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in .env.local')
  }
  return new Groq({ apiKey })
}

export async function processResumeFile(formData: FormData) {
  console.log('--- DEBUG: processResumeFile called ---')
  const file = formData.get('file') as File
  if (!file) throw new Error('No file uploaded')

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  let resumeText = ''

  // Extract text based on file type
  if (file.type === 'application/pdf') {
    try {
      resumeText = await new Promise((resolve, reject) => {
        const pdfParser = new (PDFParser as any)(null, 1)
        pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError))
        pdfParser.on("pdfParser_dataReady", () => {
          const rawText = (pdfParser as any).getRawTextContent()
          resolve(rawText)
        })
        pdfParser.parseBuffer(buffer)
      })
    } catch (err: any) {
      console.error("PDF Parsing error:", err)
      throw new Error('Failed to parse PDF document.')
    }
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
    try {
      const result = await mammoth.extractRawText({ buffer: buffer })
      resumeText = result.value
    } catch (err: any) {
      console.error("DOCX Parsing error:", err)
      throw new Error('Failed to parse DOCX.')
    }
  } else {
    try {
      resumeText = buffer.toString('utf8')
    } catch (err: any) {
      throw new Error('Unsupported file format.')
    }
  }

  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error('Could not extract enough text from the file.')
  }

  return await analyzeResume(resumeText, file.name)
}

function extractJson(text: string) {
  try {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    return JSON.parse(text)
  } catch (e) {
    console.error('JSON Extraction Error:', e, 'Raw text:', text)
    throw new Error('Failed to parse AI response')
  }
}

async function analyzeResume(resumeText: string, fileName: string) {
  console.log('--- DEBUG: analyzeResume called with Groq ---')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

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
  `

  try {
    const chatCompletion = await getGroqClient().chat.completions.create({
      messages: [
        { role: 'system', content: 'You output strict, raw JSON only. You are a robotic ATS parser.' },
        { role: 'user', content: prompt },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      response_format: { type: "json_object" },
    })

    const responseContent = chatCompletion.choices[0]?.message?.content || '{}'
    const analysis = extractJson(responseContent)

    const { error } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        file_url: fileName, 
        extracted_skills: analysis.skills || [],
        suggested_roles: analysis.roles || [],
        raw_analysis: analysis,
      })

    if (error) {
       console.error('Supabase Insert Error:', error)
       throw new Error('Failed to save analysis to database')
    }

    return analysis
  } catch (error: any) {
    console.error('Groq Analysis Error:', error.message)
    throw new Error(error.message || 'Failed to analyze resume.')
  }
}

export async function getJobRecommendations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: resume } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: prefs } = await supabase
    .from('user_job_preferences')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!resume && !prefs) return []

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30)

  if (error || !jobs || jobs.length === 0) return []

  const prompt = `
    Based on the following user resume profile and job preferences, rank the most relevant jobs from the provided list.
    Return ONLY a valid JSON object with a single key "recommendedIds" containing an array of job IDs sorted by relevance: {"recommendedIds": ["id1", "id2", ...]}.

    RESUME PROFILE:
    Skills: ${resume?.extracted_skills?.join(', ') || 'N/A'}
    Roles: ${resume?.suggested_roles?.join(', ') || 'N/A'}

    USER PREFERENCES:
    Job Functions: ${prefs?.job_functions?.join(', ') || 'N/A'}
    Job Types: ${prefs?.job_types?.join(', ') || 'N/A'}
    Work Mode: ${prefs?.work_mode || 'N/A'}
    Location: ${prefs?.location || 'N/A'}
    Experience Level: ${prefs?.experience_level || 'N/A'}
    Preferred Skills: ${prefs?.skills?.join(', ') || 'N/A'}

    JOB LIST:
    ${JSON.stringify(jobs.map((j: any) => ({ id: j.id, title: j.title, description: j.description, location: j.location, type: j.job_type })))}
    
    Respond ONLY with a valid JSON object.
  `

  try {
    const chatCompletion = await getGroqClient().chat.completions.create({
      messages: [
        { role: 'system', content: 'You output strict, raw JSON only.' },
        { role: 'user', content: prompt },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      response_format: { type: "json_object" },
    })

    const responseContent = chatCompletion.choices[0]?.message?.content || '{}'
    const { recommendedIds } = JSON.parse(responseContent)

    if (!recommendedIds || !Array.isArray(recommendedIds)) return jobs.slice(0, 6)

    return jobs
      .filter((job: any) => recommendedIds.includes(job.id))
      .sort((a: any, b: any) => recommendedIds.indexOf(a.id) - recommendedIds.indexOf(b.id))
  } catch (error) {
    console.error('Job Matching Error:', error)
    return jobs.slice(0, 6)
  }
}
