'use server'

import OpenAI from 'openai'
import { redirect } from 'next/navigation'
import { decode } from 'base64-arraybuffer'
import { supabase } from '@/lib/supabase'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function createCompletion(formData: FormData) {
  const prompt = formData.get('prompt')

  const messages: any = [
    {
      role: 'user',
      content: `Write a blog post around 200 words about the following topic: "${prompt}". Return the response in markdown format.`
    }
  ]

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages
  })

  const content = completion.choices[0].message.content

  const image = await openai.images.generate({
    model: 'dall-e-3',
    prompt: `Generate an image for a blog post about "${prompt}"`,
    n: 1,
    size: '1792x1024',
    response_format: 'b64_json'
  })

  const imageData = image.data[0].b64_json as string
  const imageName = `blog-${Date.now()}`

  const { data, error } = await supabase.storage
    .from('blogs')
    .upload(imageName, decode(imageData), {
      contentType: 'image/png'
    })

  const path = data?.path
  const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/blogs/${path}`

  const { data: blog, error: blogError } = await supabase
    .from('blogs')
    .insert([{ title: prompt, content, imageUrl }])
    .select()

  const blogId = blog?.[0].id

  redirect(`/blog/${blogId}`)
}
