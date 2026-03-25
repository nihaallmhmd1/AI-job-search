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
      .eq('job_id', jobId)
      .eq('user_id', user.id)
      
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

  // Find existing
  const { data: existing } = await supabase
    .from('saved_jobs')
    .select('id')
    .eq('job_id', jobId)
    .eq('user_id', user.id)
    .single()

  let query
  if (existing) {
    query = supabase
      .from('saved_jobs')
      .update({ status: status })
      .eq('id', existing.id)
      .select()
      .single()
  } else {
    query = supabase
      .from('saved_jobs')
      .insert({ status: status, job_id: jobId, user_id: user.id })
      .select()
      .single()
  }

  const { data, error } = await query
  if (error) throw new Error('Failed to update status')
  return data
}
