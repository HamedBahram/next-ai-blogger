import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'
import { getBlogById } from '@/lib/supabase'

export default async function Blog({ params }: { params: { id: string } }) {
  const { content, imageUrl } = await getBlogById(Number(params.id))

  return (
    <section className='prose mx-auto max-w-xl py-12'>
      <Link href='/' className='text-sm font-light text-gray-500 no-underline'>
        ← <span className='ml-0.5'>Go back</span>
      </Link>

      <Image alt='' src={imageUrl} width={1792} height={1024} />
      <Markdown>{content}</Markdown>
    </section>
  )
}
