import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ResumeUploadUI from './ResumeUploadUI'

export default async function ResumePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return <ResumeUploadUI user={user} />
}
