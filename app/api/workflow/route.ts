import OpenAI from 'openai'

import prisma from '@/lib/prisma'
import { put } from '@vercel/blob'
import { decode } from 'base64-arraybuffer'
import { serve } from '@upstash/workflow/nextjs'
import { revalidatePath } from 'next/cache'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface RequestPayload {
  prompt: string
  userId: string
  blogId: string
}

export const { POST } = serve<RequestPayload>(async context => {
  const input = context.requestPayload
  const { prompt, blogId } = input

  const content = await context.run('generate-blog-content', async () => {
    if (!prompt) throw new Error('Prompt is required')

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
    if (!content) throw new Error('Unable to generate the blog content.')

    return content
  })

  const imageUrl = await context.run('generate-blog-image', async () => {
    const image = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Generate an image for a blog post about "${prompt}"`,
      n: 1,
      size: '1792x1024',
      response_format: 'b64_json'
    })

    const imageData = image?.data?.[0]?.b64_json as string
    if (!imageData) throw new Error('Unable to generate the blog image.')

    const imageName = `blog-${Date.now()}`
    const { url } = await put(imageName, decode(imageData), {
      access: 'public'
    })

    if (!url) throw new Error('Unable to upload the blog image to Storage.')

    return url
  })

  await context.run('create-blog', async () => {
    await prisma.blog.update({
      where: {
        id: blogId
      },
      data: {
        content,
        imageUrl
      }
    })

    revalidatePath(`/blog/${blogId}`)
  })
})
