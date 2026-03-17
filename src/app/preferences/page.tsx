'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Save, Loader2, Check, Bell } from 'lucide-react'
import { getUserPreferences, saveUserPreferences } from '@/app/actions/preferences'
import { toast } from 'react-hot-toast'

const JOB_CATEGORIES: Record<string, string[]> = {
  'Software Engineering': [
    'Backend Engineer', 'Frontend Engineer', 'Full Stack Engineer', 'Software Engineer', 'Software Developer', 'Web Developer',
    'Mobile App Developer', 'Android Developer', 'iOS Developer', 'React Developer', 'Angular Developer', 'Vue.js Developer',
    'Node.js Developer', 'Python Developer', 'Java Developer', 'C++ Developer', 'Golang Developer', '.NET Developer',
    'PHP Developer', 'Ruby on Rails Developer', 'Laravel Developer', 'Django Developer', 'Flask Developer',
    'Spring Boot Developer', 'WordPress Developer', 'Shopify Developer', 'API Developer', 'GraphQL Developer',
    'Microservices Developer', 'Cloud Developer', 'DevOps Engineer', 'Site Reliability Engineer', 'Platform Engineer',
    'Systems Engineer', 'Embedded Systems Engineer', 'Firmware Engineer', 'Kernel Developer', 'Game Developer',
    'Unity Developer', 'Unreal Engine Developer', 'AR Developer', 'VR Developer', 'Blockchain Developer',
    'Smart Contract Developer', 'Web3 Developer', 'Crypto Developer', 'Technical Lead', 'Software Architect',
    'Solutions Architect', 'Enterprise Architect', 'Integration Engineer', 'Build Engineer', 'Release Engineer',
    'QA Automation Engineer', 'Test Automation Engineer', 'Software Tester', 'Quality Assurance Engineer',
    'Performance Engineer', 'Security Engineer', 'Application Security Engineer'
  ],
  'Data & Analytics': [
    'Data Analyst', 'Senior Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'AI Engineer', 'NLP Engineer',
    'Computer Vision Engineer', 'Data Engineer', 'Big Data Engineer', 'Analytics Engineer', 'BI Analyst',
    'Business Intelligence Developer', 'Power BI Developer', 'Tableau Developer', 'ETL Developer', 'Data Warehouse Engineer',
    'Data Architect', 'Data Modeler', 'Quantitative Analyst', 'Research Data Scientist', 'Deep Learning Engineer',
    'Reinforcement Learning Engineer', 'AI Researcher', 'AI Scientist', 'Applied AI Engineer', 'MLOps Engineer',
    'Data Quality Engineer', 'Data Governance Specialist', 'Data Visualization Engineer', 'Data Platform Engineer',
    'Statistical Analyst', 'Financial Data Analyst', 'Marketing Data Analyst', 'Risk Analyst', 'Product Data Analyst',
    'Healthcare Data Analyst', 'Fraud Analyst', 'Supply Chain Analyst', 'Operations Analyst', 'Forecasting Analyst',
    'Business Analyst', 'Technical Business Analyst', 'Strategy Analyst', 'Growth Analyst', 'Experimentation Analyst',
    'Data Operations Engineer', 'Decision Scientist', 'AI Product Analyst', 'Data Strategy Manager', 'Data Science Manager',
    'Head of Data', 'Chief Data Officer', 'AI Program Manager', 'Data Researcher', 'Quant Developer',
    'Quant Researcher', 'AI Ethics Researcher', 'Knowledge Graph Engineer', 'Data Mining Engineer'
  ],
  'Product Management': [
    'Product Manager', 'Senior Product Manager', 'Associate Product Manager', 'Technical Product Manager',
    'AI Product Manager', 'SaaS Product Manager', 'Consumer Product Manager', 'Growth Product Manager',
    'Platform Product Manager', 'Product Owner', 'Product Analyst', 'Product Strategy Manager',
    'Product Operations Manager', 'Product Marketing Manager', 'Product Designer', 'UX Product Manager',
    'Mobile Product Manager', 'Data Product Manager', 'Marketplace Product Manager', 'Fintech Product Manager',
    'Healthtech Product Manager', 'EdTech Product Manager', 'B2B Product Manager', 'B2C Product Manager',
    'Head of Product', 'Director of Product', 'VP Product', 'Chief Product Officer', 'Product Innovation Manager',
    'Product Growth Manager', 'Product Researcher', 'Product Insights Manager', 'Product Strategy Director',
    'Product Delivery Manager', 'Product Launch Manager', 'Product Lifecycle Manager', 'Product Program Manager',
    'Product Portfolio Manager', 'Product Engineering Manager', 'Platform Strategy Manager', 'Digital Product Manager',
    'Software Product Manager', 'Hardware Product Manager', 'AI Platform Manager', 'Product Ecosystem Manager',
    'Partner Product Manager', 'Product Quality Manager', 'Product Compliance Manager', 'Product Monetization Manager',
    'Product Roadmap Manager'
  ],
  'Design': [
    'UI Designer', 'UX Designer', 'UI/UX Designer', 'Product Designer', 'Graphic Designer', 'Motion Designer',
    'Interaction Designer', 'Visual Designer', 'Web Designer', 'Mobile UI Designer', 'UX Researcher',
    'Design Researcher', 'Service Designer', 'Design System Engineer', 'Creative Designer', 'Brand Designer',
    'Illustration Designer', 'Animation Designer', 'Game Designer', 'AR/VR Designer', 'Industrial Designer',
    'Interior Designer', 'Fashion Designer', 'Experience Designer', 'Digital Designer', 'Presentation Designer',
    'Marketing Designer', 'Social Media Designer', 'Infographic Designer', 'Packaging Designer',
    'Product Visual Designer', 'Interaction Researcher', 'Accessibility Designer', 'UX Writer', 'Content Designer',
    'Microcopy Writer', 'Storyboard Artist', 'Creative Director', 'Design Director', 'Head of Design'
  ],
  'Marketing': [
    'Digital Marketing Manager', 'SEO Specialist', 'SEM Specialist', 'Content Marketing Manager', 'Content Strategist',
    'Copywriter', 'Brand Manager', 'Marketing Manager', 'Growth Marketer', 'Performance Marketing Manager',
    'Email Marketing Specialist', 'Social Media Manager', 'Social Media Strategist', 'Influencer Marketing Manager',
    'Affiliate Marketing Manager', 'Campaign Manager', 'Marketing Analyst', 'Marketing Automation Specialist',
    'Product Marketing Manager', 'Marketing Operations Manager', 'Demand Generation Manager', 'Lead Generation Specialist',
    'Community Manager', 'PR Manager', 'Public Relations Specialist', 'Corporate Communications Manager', 'Media Planner',
    'Advertising Manager', 'Marketing Research Analyst', 'Brand Strategist', 'Creative Strategist',
    'Marketing Coordinator', 'Digital Campaign Manager', 'Event Marketing Manager', 'Partnership Marketing Manager',
    'Mobile Marketing Specialist', 'Video Marketing Specialist', 'Podcast Marketing Manager',
    'International Marketing Manager', 'Local Marketing Manager', 'Retail Marketing Manager', 'Field Marketing Manager',
    'Marketing Data Analyst', 'CRM Marketing Manager', 'Lifecycle Marketing Manager', 'Customer Marketing Manager',
    'Marketing Technology Manager', 'Marketing Director', 'VP Marketing', 'Chief Marketing Officer'
  ],
  'Sales & Business Development': [
    'Sales Executive', 'Sales Representative', 'Business Development Executive', 'Business Development Manager',
    'Account Executive', 'Account Manager', 'Enterprise Account Executive', 'Strategic Account Manager',
    'Key Account Manager', 'Sales Development Representative', 'Business Development Representative',
    'Sales Manager', 'Regional Sales Manager', 'Territory Sales Manager', 'Sales Operations Manager',
    'Revenue Operations Manager', 'Sales Analyst', 'Customer Success Manager', 'Customer Success Executive',
    'Customer Success Director', 'Customer Experience Manager', 'Inside Sales Representative', 'Outside Sales Representative',
    'Channel Sales Manager', 'Partner Sales Manager', 'International Sales Manager', 'Retail Sales Manager',
    'Field Sales Executive', 'Technical Sales Engineer', 'Pre-Sales Engineer', 'Solutions Consultant',
    'Sales Consultant', 'Sales Trainer', 'Sales Enablement Manager', 'Deal Desk Analyst', 'Revenue Analyst',
    'Pricing Analyst', 'Commercial Manager', 'Business Strategy Manager', 'Sales Director', 'VP Sales',
    'Chief Revenue Officer', 'Strategic Partnerships Manager', 'Alliance Manager', 'SaaS Sales Manager'
  ],
  'Finance': [
    'Financial Analyst', 'Investment Analyst', 'Portfolio Manager', 'Equity Research Analyst', 'Risk Analyst',
    'Credit Analyst', 'Treasury Analyst', 'Corporate Finance Analyst', 'Finance Manager', 'Accounting Manager',
    'Accountant', 'Chartered Accountant', 'Tax Consultant', 'Tax Analyst', 'Audit Manager', 'Internal Auditor',
    'External Auditor', 'Compliance Analyst', 'Financial Controller', 'Budget Analyst', 'Cost Accountant',
    'Payroll Manager', 'Billing Specialist', 'Financial Planner', 'Wealth Manager', 'Private Banker',
    'Hedge Fund Analyst', 'Venture Capital Analyst', 'Investment Banker', 'Corporate Banker', 'M&A Analyst',
    'Financial Risk Manager', 'Financial Reporting Analyst', 'Forensic Accountant', 'Actuary',
    'Quantitative Analyst', 'Director of Finance', 'VP Finance', 'CFO', 'Financial Operations Manager'
  ],
  'Operations & Management': [
    'Operations Manager', 'Business Operations Manager', 'Strategy Manager', 'Program Manager', 'Project Manager',
    'Technical Program Manager', 'Scrum Master', 'Agile Coach', 'Delivery Manager', 'Implementation Manager',
    'Operations Analyst', 'Supply Chain Manager', 'Logistics Manager', 'Procurement Manager', 'Vendor Manager',
    'Inventory Manager', 'Warehouse Manager', 'Manufacturing Manager', 'Production Manager', 'Quality Control Manager',
    'Continuous Improvement Manager', 'Process Improvement Specialist', 'Lean Six Sigma Consultant',
    'Change Management Manager', 'Transformation Manager', 'Operations Research Analyst', 'Planning Manager',
    'Resource Manager', 'Workforce Planning Analyst', 'Facilities Manager', 'Administrative Manager', 'Office Manager',
    'Operations Director', 'VP Operations', 'COO', 'Global Operations Manager', 'Regional Operations Manager',
    'Service Delivery Manager', 'Customer Operations Manager', 'Business Process Manager', 'Contract Manager',
    'Compliance Manager', 'Risk Manager', 'Governance Manager', 'Sustainability Manager', 'ESG Analyst',
    'Safety Manager'
  ],
  'HR & People': [
    'HR Manager', 'HR Business Partner', 'Talent Acquisition Specialist', 'Recruiter', 'Technical Recruiter',
    'Executive Recruiter', 'Campus Recruiter', 'HR Analyst', 'HR Operations Manager', 'Compensation & Benefits Manager',
    'Learning & Development Manager', 'Training Manager', 'Organizational Development Manager',
    'Employee Engagement Manager', 'Diversity & Inclusion Manager', 'People Operations Manager', 'HR Director',
    'VP HR', 'Chief Human Resources Officer'
  ],
  'Customer Support': [
    'Customer Support Executive', 'Customer Service Representative', 'Customer Support Manager',
    'Technical Support Engineer', 'Helpdesk Technician', 'IT Support Specialist', 'Field Support Engineer',
    'Support Operations Manager', 'Community Support Manager', 'Knowledge Base Manager'
  ],
  'Legal & Compliance': [
    'Legal Counsel', 'Corporate Lawyer', 'Compliance Lawyer', 'Legal Analyst', 'Contract Lawyer', 'Paralegal',
    'Legal Operations Manager', 'Policy Analyst'
  ],
  'Research & Healthcare': [
    'Research Analyst', 'Research Scientist', 'Lab Technician', 'Biotech Researcher', 'Clinical Research Associate',
    'Healthcare Administrator', 'Hospital Manager', 'Medical Representative', 'Pharmacist', 'Doctor', 'Nurse',
    'Therapist', 'Psychologist', 'Nutritionist'
  ],
  'Creative & Media': [
    'Fitness Trainer', 'Journalist', 'Editor', 'News Reporter', 'Technical Writer', 'Content Writer', 'Blogger',
    'Video Editor', 'Photographer', 'Filmmaker', 'Sound Engineer', 'Event Manager', 'Wedding Planner'
  ],
  'Other': [
    'Hospitality Manager', 'Hotel Manager', 'Travel Consultant', 'Logistics Coordinator',
    'Security Officer', 'Government Officer', 'Public Administrator', 'Entrepreneur'
  ]
}

// Flat list for easy search
const ALL_JOB_ROLES = Object.values(JOB_CATEGORIES).flat()

const EXPERIENCES = ['Internship', 'Entry Level', 'Junior', 'Mid Level', 'Senior']
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']
const SALARIES = ['3L - 5L', '5L - 10L', '10L - 20L', '20L+']

export default function PreferencesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [jobFunctions, setJobFunctions] = useState<string[]>([])
  const [searchFn, setSearchFn] = useState('')
  
  const [jobTypes, setJobTypes] = useState<string[]>([])
  const [workMode, setWorkMode] = useState<string>('Any')
  const [location, setLocation] = useState('')
  const [openToRemote, setOpenToRemote] = useState(false)
  const [experience, setExperience] = useState('')
  const [salary, setSalary] = useState('')
  
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  useEffect(() => {
    async function load() {
      const prefs = await getUserPreferences()
      if (prefs) {
        setJobFunctions(prefs.job_functions || [])
        setJobTypes(prefs.job_types || [])
        setWorkMode(prefs.work_mode || 'Any')
        setLocation(prefs.location || '')
        setOpenToRemote(prefs.location ? prefs.location.toLowerCase().includes('remote') : false)
        setExperience(prefs.experience_level || '')
        setSalary(prefs.salary_range || '')
        setSkills(prefs.skills || [])
        setNotificationsEnabled(prefs.notifications_enabled || false)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveUserPreferences({
        job_functions: jobFunctions,
        job_types: jobTypes,
        work_mode: workMode,
        location: openToRemote ? `${location} (Open to Remote)` : location,
        experience_level: experience,
        salary_range: salary,
        skills: skills,
        notifications_enabled: notificationsEnabled
      })
      toast.success('Preferences saved successfully!')
      router.push('/dashboard')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleJobType = (type: string) => {
    if (jobTypes.includes(type)) setJobTypes(jobTypes.filter(t => t !== type))
    else setJobTypes([...jobTypes, type])
  }

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault()
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()])
      }
      setSkillInput('')
    }
  }

  // Build filtered, categorized results for the dropdown
  const filteredCategories = searchFn.trim()
    ? Object.entries(JOB_CATEGORIES).reduce((acc, [cat, roles]) => {
        const matched = roles.filter(r => r.toLowerCase().includes(searchFn.toLowerCase()))
        if (matched.length > 0) acc[cat] = matched
        return acc
      }, {} as Record<string, string[]>)
    : JOB_CATEGORIES

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-24">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16">
      <div className="lg:w-1/3">
        <div className="sticky top-24">
          <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200 mb-6">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
            Tell us what kind of roles you're looking for.
          </h1>
          <p className="text-base text-gray-500 font-medium">
            Set your preferences so we can show the most relevant jobs for you.
          </p>
        </div>
      </div>

      <div className="lg:w-2/3 max-w-2xl bg-white border border-gray-100 rounded-[32px] p-8 sm:p-12 shadow-sm space-y-10">
        
        {/* Job Functions */}
        <section>
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">1. Job Function</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {jobFunctions.map(fn => (
              <span key={fn} className="px-3 py-1.5 bg-gray-900 text-white text-[11px] font-bold rounded-lg flex items-center gap-2">
                {fn}
                <button onClick={() => setJobFunctions(jobFunctions.filter(f => f !== fn))} className="hover:text-red-400">&times;</button>
              </span>
            ))}
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search 500+ roles..." 
              value={searchFn}
              onChange={e => setSearchFn(e.target.value)}
              className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 outline-none"
            />
            {searchFn && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-72 overflow-y-auto z-50 p-2">
                {Object.entries(filteredCategories).map(([cat, roles]) => (
                  <div key={cat}>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-3 pt-3 pb-1">{cat}</p>
                    {roles.map(fn => (
                      <button 
                        key={fn}
                        onClick={() => {
                          if (!jobFunctions.includes(fn)) setJobFunctions([...jobFunctions, fn])
                          setSearchFn('')
                        }}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        {fn}
                      </button>
                    ))}
                  </div>
                ))}
                {Object.keys(filteredCategories).length === 0 && (
                  <p className="text-sm text-gray-400 px-4 py-3">No roles found.</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Job Type */}
        <section>
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">2. Job Type</label>
          <div className="flex flex-wrap gap-3">
            {JOB_TYPES.map(type => (
              <button 
                key={type}
                onClick={() => toggleJobType(type)}
                className={`px-5 py-2.5 text-[11px] font-bold rounded-xl border transition-all flex items-center gap-2 ${jobTypes.includes(type) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
              >
                {jobTypes.includes(type) && <Check className="w-3 h-3" />}
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Work Mode */}
        <section>
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">3. Work Mode</label>
          <div className="flex flex-wrap gap-3">
            {['Remote', 'Hybrid', 'On-site', 'Any'].map(mode => (
              <button 
                key={mode}
                onClick={() => setWorkMode(mode)}
                className={`px-5 py-2.5 text-[11px] font-bold rounded-xl border transition-all ${workMode === mode ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        {/* Location */}
        <section>
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">4. Location</label>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="e.g. Bangalore, London, Anywhere" 
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="flex-1 px-5 py-3.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 outline-none"
            />
            <button 
              onClick={() => setOpenToRemote(!openToRemote)}
              className={`px-5 py-3.5 text-[11px] font-bold rounded-xl border transition-all flex items-center gap-2 ${openToRemote ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
            >
              {openToRemote && <Check className="w-3 h-3" />} Open to Remote
            </button>
          </div>
        </section>

        {/* Experience & Salary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">5. Experience Level</label>
            <select 
              value={experience} 
              onChange={e => setExperience(e.target.value)}
              className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-gray-900 outline-none appearance-none"
            >
              <option value="">Select Level</option>
              {EXPERIENCES.map(exp => <option key={exp} value={exp}>{exp}</option>)}
            </select>
          </section>

          <section>
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">6. Salary Expectation</label>
            <select 
              value={salary} 
              onChange={e => setSalary(e.target.value)}
              className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-gray-900 outline-none appearance-none"
            >
              <option value="">Optional</option>
              {SALARIES.map(sal => <option key={sal} value={sal}>{sal}</option>)}
            </select>
          </section>
        </div>

        {/* Skills */}
        <section>
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">7. Skills</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map(skill => (
              <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100/50 text-[11px] font-bold rounded-lg flex items-center gap-2">
                {skill}
                <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="hover:text-blue-800">&times;</button>
              </span>
            ))}
          </div>
          <input 
            type="text" 
            placeholder="Type a skill and press Enter..." 
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={addSkill}
            className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 outline-none"
          />
        </section>

        {/* Notifications Toggle */}
        <section className="p-6 bg-gray-50 rounded-[28px] border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${notificationsEnabled ? 'bg-blue-500 text-white shadow-lg shadow-blue-100' : 'bg-gray-200 text-gray-400'}`}>
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-900">Notifications</p>
              <p className="text-[10px] text-gray-500 font-medium">Get notified about new preferred job matches.</p>
            </div>
          </div>
          <button 
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${notificationsEnabled ? 'bg-gray-900' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </section>

        {/* Save */}
        <div className="pt-8 mt-8 border-t border-gray-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-gray-200"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>

      </div>
    </div>
  )
}
