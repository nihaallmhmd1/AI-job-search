import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SAMPLE_JOBS = [
  { title: 'Senior Software Engineer', company: 'Google', location: 'Remote', job_type: 'Full-time', salary: '$150k - $200k', description: 'Build scalable systems for our core search infrastructure. Work with Go, Python, and Kubernetes. Requires 5+ years experience in distributed systems.', apply_link: 'https://www.google.com/about/careers/applications/jobs/results/?q=Software+Engineer', source: 'Seed' },
  { title: 'Frontend Engineer', company: 'Airbnb', location: 'Remote / San Francisco', job_type: 'Full-time', salary: '$120k - $160k', description: 'Build beautiful, accessible UI for millions of users. React, TypeScript, CSS-in-JS. Strong eye for design required.', apply_link: 'https://careers.airbnb.com/positions/?department=Engineering', source: 'Seed' },
  { title: 'Backend Engineer - Python', company: 'Stripe', location: 'Remote', job_type: 'Full-time', salary: '$130k - $180k', description: 'Design and build payment processing systems. Python, PostgreSQL, Redis. Experience with financial systems preferred.', apply_link: 'https://stripe.com/jobs/listing?teams[]=Engineering', source: 'Seed' },
  { title: 'Full Stack Engineer', company: 'Notion', location: 'Remote', job_type: 'Full-time', salary: '$110k - $150k', description: 'Work across our entire stack from React frontend to Node.js backend. TypeScript, PostgreSQL. Collaborative team environment.', apply_link: 'https://www.notion.so/careers#open-roles', source: 'Seed' },
  { title: 'Machine Learning Engineer', company: 'OpenAI', location: 'San Francisco', job_type: 'Full-time', salary: '$180k - $250k', description: 'Train and deploy large language models. Python, PyTorch, CUDA. PhD or equivalent research experience required.', apply_link: 'https://openai.com/careers#open-roles', source: 'Seed' },
  { title: 'Data Scientist', company: 'Netflix', location: 'Los Gatos / Remote', job_type: 'Full-time', salary: '$140k - $190k', description: 'Drive content strategy with data insights. Python, SQL, A/B testing, causal inference. Experience in media/entertainment preferred.', apply_link: 'https://jobs.netflix.com/search?q=data+scientist', source: 'Seed' },
  { title: 'DevOps Engineer', company: 'Shopify', location: 'Remote', job_type: 'Full-time', salary: '$100k - $140k', description: 'Scale our CI/CD pipelines and cloud infrastructure. Kubernetes, Terraform, AWS. Incident response experience needed.', apply_link: 'https://www.shopify.com/careers/search?q=devops', source: 'Seed' },
  { title: 'iOS Developer', company: 'Spotify', location: 'Stockholm / Remote', job_type: 'Full-time', salary: '$100k - $140k', description: 'Build the Spotify iOS app used by 500M+ users. Swift, UIKit/SwiftUI, Objective-C. Experience with audio streaming a bonus.', apply_link: 'https://www.lifeatspotify.com/jobs?l=remote&d=engineering', source: 'Seed' },
  { title: 'Android Developer', company: 'Grab', location: 'Singapore / Remote', job_type: 'Full-time', salary: 'SGD 7k - 12k/mo', description: 'Build features for Southeast Asia\'s super app. Kotlin, Jetpack Compose, Android SDK. 3+ years Android experience.', apply_link: 'https://grab.careers/jobs/?keyword=android', source: 'Seed' },
  { title: 'Product Manager', company: 'Figma', location: 'San Francisco / Remote', job_type: 'Full-time', salary: '$130k - $170k', description: 'Define the roadmap for our design tools used by millions. Cross-functional collaboration, UX research, data-driven decisions.', apply_link: 'https://www.figma.com/careers/#job-openings', source: 'Seed' },
  { title: 'Data Engineer', company: 'Snowflake', location: 'Remote', job_type: 'Full-time', salary: '$120k - $160k', description: 'Build data pipelines and infrastructure. Python, SQL, Spark, dbt. Experience with cloud data warehouses essential.', apply_link: 'https://careers.snowflake.com/us/en/search-results?keywords=data+engineer', source: 'Seed' },
  { title: 'UX Designer', company: 'Atlassian', location: 'Remote', job_type: 'Full-time', salary: '$80k - $120k', description: 'Design experiences for Jira, Confluence and Trello. Figma, user research, prototyping. Portfolio required.', apply_link: 'https://www.atlassian.com/company/careers/all-jobs?team=Design', source: 'Seed' },
  { title: 'Software Engineering Intern', company: 'Microsoft', location: 'Redmond / Remote', job_type: 'Internship', salary: '$45/hour', description: 'Summer internship in the Azure team. C#, .NET, cloud infrastructure. 3rd or 4th year CS student preferred.', apply_link: 'https://careers.microsoft.com/students/us/en/search-results?keywords=software+engineering+intern', source: 'Seed' },
  { title: 'Junior Frontend Developer', company: 'Canva', location: 'Remote', job_type: 'Full-time', salary: '$60k - $90k', description: 'Entry level role in our design editor team. React, TypeScript, HTML/CSS. 0-2 years experience welcome.', apply_link: 'https://www.canva.com/careers/jobs/?department=Engineering', source: 'Seed' },
  { title: 'Site Reliability Engineer', company: 'Cloudflare', location: 'Remote', job_type: 'Full-time', salary: '$130k - $170k', description: 'Keep our edge network running at 99.99% uptime. Go, Linux, networking fundamentals. On-call rotation required.', apply_link: 'https://www.cloudflare.com/careers/jobs/?department=Engineering&location=Remote', source: 'Seed' },
  { title: 'ML Engineer', company: 'Weights & Biases', location: 'Remote', job_type: 'Full-time', salary: '$110k - $150k', description: 'Build infrastructure for training and deploying ML models. Python, Docker, Kubernetes, GPU clusters.', apply_link: 'https://wandb.ai/site/company/careers#open-roles', source: 'Seed' },
  { title: 'Data Analyst', company: 'Airbnb', location: 'Remote', job_type: 'Full-time', salary: '$90k - $130k', description: 'Analyze host and guest behavior using our massive datasets. SQL, Python, Tableau, statistical modeling.', apply_link: 'https://careers.airbnb.com/positions/?department=Analytics', source: 'Seed' },
  { title: 'Backend Engineer - Node.js', company: 'Twilio', location: 'Remote', job_type: 'Full-time', salary: '$110k - $150k', description: 'Build APIs for our communications platform. Node.js, TypeScript, PostgreSQL, Redis. 3+ years backend experience.', apply_link: 'https://careers.twilio.com/jobs?search=backend+engineer', source: 'Seed' },
  { title: 'React Native Developer', company: 'Coinbase', location: 'Remote', job_type: 'Full-time', salary: '$120k - $160k', description: 'Build the Coinbase mobile app for iOS and Android. React Native, TypeScript, blockchain APIs. Crypto experience a plus.', apply_link: 'https://www.coinbase.com/careers/positions?department=Engineering', source: 'Seed' },
  { title: 'AI Engineer', company: 'Anthropic', location: 'San Francisco', job_type: 'Full-time', salary: '$160k - $220k', description: 'Build production AI systems with Claude. Python, LLM APIs, prompt engineering, RAG. Strong engineering fundamentals required.', apply_link: 'https://www.anthropic.com/careers#open-roles', source: 'Seed' },
  { title: 'Cloud Engineer', company: 'HashiCorp', location: 'Remote', job_type: 'Full-time', salary: '$120k - $160k', description: 'Build infrastructure tooling used by engineers worldwide. Go, Terraform, Vault. Open source contribution experience valued.', apply_link: 'https://www.hashicorp.com/careers?department=Engineering', source: 'Seed' },
  { title: 'Product Designer', company: 'Linear', location: 'Remote', job_type: 'Full-time', salary: '$100k - $140k', description: 'Craft the design for our beloved project management tool. Figma, motion design, design systems. Small team, big impact.', apply_link: 'https://linear.app/careers', source: 'Seed' },
  { title: 'Data Science Intern', company: 'Meta', location: 'Menlo Park', job_type: 'Internship', salary: '$50/hour', description: 'Summer internship analyzing social network data. Python, SQL, statistical modeling. PhD student preferred.', apply_link: 'https://www.metacareers.com/jobs?roles[0]=intern&q=data+science', source: 'Seed' },
  { title: 'Platform Engineer', company: 'Vercel', location: 'Remote', job_type: 'Full-time', salary: '$130k - $175k', description: 'Build the infrastructure that runs millions of Next.js apps. Rust, Go, edge computing, CDN optimization.', apply_link: 'https://vercel.com/careers#open-positions', source: 'Seed' },
]

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .upsert(SAMPLE_JOBS, { onConflict: 'apply_link' })
      .select()

    if (error) {
      // If upsert fails (no unique constraint on apply_link), try plain insert
      const { data: insertData, error: insertError } = await supabase
        .from('jobs')
        .insert(SAMPLE_JOBS)
        .select()
      
      if (insertError) throw insertError
      return NextResponse.json({ success: true, message: `Seeded ${insertData?.length} jobs`, count: insertData?.length })
    }

    return NextResponse.json({ success: true, message: `Seeded ${data?.length} jobs`, count: data?.length })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
