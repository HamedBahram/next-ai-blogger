import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'

import { ChevronLeft } from 'lucide-react'
import { getBlogById } from '@/lib/blogs'
import { notFound } from 'next/navigation'

export default async function Blog({ params }: { params: { id: string } }) {
  const blog = await getBlogById(params.id)

  if (!blog) {
    notFound()
  }

  const { imageUrl, content } = blog

  return (
    <section className='py-12'>
      <div className='container max-w-3xl'>
        <Link
          href='/'
          className='-ml-2 inline-flex items-center text-sm font-light text-gray-500 no-underline hover:text-gray-700'
        >
          <ChevronLeft strokeWidth={1} size={20} />
          <span>Go back</span>
        </Link>

        <section className='prose mt-6 max-w-none'>
          <Image alt='' src={imageUrl} width={1792} height={1024} />
          <Markdown>{content}</Markdown>
        </section>
      </div>
    </section>
  )
}
