'use server'

import OpenAI from 'openai'
import { redirect } from 'next/navigation'
import { decode } from 'base64-arraybuffer'

import { put } from '@vercel/blob'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs'
import prisma from '@/lib/prisma'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function createCompletion(prompt: string) {
  if (!prompt) {
    return { error: 'Prompt is required' }
  }

  const { userId } = auth()
  if (!userId) {
    return { error: 'User is not logged in' }
  }

  const messages: any = [
    {
      role: 'user',
      content: `Write a blog post around 200 words about the following topic: "${prompt}" in markdown format.`
    }
  ]

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages
  })

  const content = completion?.choices?.[0]?.message?.content
  if (!content) {
    return { error: 'Unable to generate the blog content.' }
  }

  const image = await openai.images.generate({
    model: 'dall-e-3',
    prompt: `Generate an image for a blog post about "${prompt}"`,
    n: 1,
    size: '1792x1024',
    response_format: 'b64_json'
  })

  const imageName = `blog-${Date.now()}`
  const imageData = image?.data?.[0]?.b64_json as string
  if (!imageData) {
    return { error: 'Unable to generate the blog image.' }
  }

  const { url } = await put(imageName, decode(imageData), {
    access: 'public'
  })

  if (!url) {
    return { error: 'Unable to upload the blog image to Storage.' }
  }

  const blog = await prisma.blog.create({
    data: {
      title: prompt,
      content,
      imageUrl: url,
      userId
    }
  })

  if (!blog) {
    return { error: 'Unable to insert the blog into the database.' }
  }

  revalidatePath('/')
  redirect(`/blog/${blog.id}`)
}
