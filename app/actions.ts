'use server'

import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { Client } from '@upstash/workflow'
const client = new Client({ token: process.env.QSTASH_TOKEN })

export async function createCompletion(prompt: string) {
  if (!prompt) {
    return { error: 'Prompt is required' }
  }

  const { userId } = auth()
  if (!userId) {
    return { error: 'User is not logged in' }
  }

  const blog = await prisma.blog.create({
    data: {
      title: prompt,
      userId
    }
  })

  const { workflowRunId } = await client.trigger({
    url: `${process.env.UPSTASH_WORKFLOW_URL}/api/workflow`,
    body: JSON.stringify({ prompt, blogId: blog.id })
  })

  revalidatePath('/')
  redirect(`/blog/${blog.id}`)
}
