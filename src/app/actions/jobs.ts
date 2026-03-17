'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleSaveJob(jobId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data: existing } = await supabase
    .from('saved_jobs')
    .select('id')
    .eq('user_id', user.id)
    .eq('job_id', jobId)
    .single()

  if (existing) {
    await supabase
      .from('saved_jobs')
      .delete()
      .eq('id', existing.id)
  } else {
    await supabase
      .from('saved_jobs')
      .insert({
        user_id: user.id,
        job_id: jobId,
        status: 'interested'
      })
  }

  revalidatePath('/dashboard')
  revalidatePath('/saved')
}

export async function updateJobStatus(jobId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('saved_jobs')
    .update({ status })
    .eq('user_id', user.id)
    .eq('job_id', jobId)

  if (error) throw error
  revalidatePath('/saved')
}
