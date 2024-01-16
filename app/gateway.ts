'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs'

export async function createCompletion(prompt: string) {
  if (!prompt) {
    return { error: 'Prompt is required' }
  }

  const { userId } = auth()
  if (!userId) {
    return { error: 'User is not logged in' }
  }

  const endpoint = `${process.env.GATEWAY_URL}/v1/blogs`
  if (!endpoint) {
    return { error: 'Gateway URL is not defined' }
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GATEWAY_API_KEY}`
    },
    body: JSON.stringify({ prompt, userId })
  })

  const blog = await response.json()
  if (!blog || blog.error) {
    return { error: blog?.error || 'Unable to create the blog' }
  }

  revalidatePath('/')
  redirect(`/blog/${blog.id}`)
}
