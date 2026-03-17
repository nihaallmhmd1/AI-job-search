'use server'

import { createClient } from '@/lib/supabase/server'

export async function toggleSavedJob(jobId: string, isSaved: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  if (isSaved) {
    // Unsave
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('user_id', user.id)
      .eq('job_id', jobId)
      
    if (error) throw new Error('Failed to unsave job')
    return false
  } else {
    // Save
    const { error } = await supabase
      .from('saved_jobs')
      .insert({
        user_id: user.id,
        job_id: jobId
      })
      
    if (error) throw new Error('Failed to save job')
    return true
  }
}

export async function updateApplicationStatus(jobId: string, status: 'Applied' | 'Interested' | 'Rejected') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('job_applications')
    .upsert({
      user_id: user.id,
      job_id: jobId,
      status: status,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id, job_id' })
    .select()
    .single()

  if (error) throw new Error('Failed to update status')
  return data
}
