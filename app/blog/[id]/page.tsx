'use client'

import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'
import { ChevronLeft } from 'lucide-react'
import BlogLoadingSkeleton from '@/components/blog-loading-skeleton'
import { useEffect, useState, useRef } from 'react'

export default function Blog({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchBlog = async () => {
      const response = await fetch(`/api/blog/${params.id}`)
      const data = await response.json()

      if (data?.content) {
        setBlog(data)
        setIsLoading(false)

        // Clear interval once content is ready
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }

    // Initial fetch
    fetchBlog()

    // Set up polling every 2 seconds
    intervalRef.current = setInterval(fetchBlog, 2000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [params.id])

  if (isLoading) return <BlogLoadingSkeleton />

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
          {blog.imageUrl && (
            <Image alt='' src={blog.imageUrl} width={1792} height={1024} />
          )}
          <Markdown>{blog.content}</Markdown>
        </section>
      </div>
    </section>
  )
}
