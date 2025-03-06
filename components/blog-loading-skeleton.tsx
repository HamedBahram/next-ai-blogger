import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function BlogLoadingSkeleton() {
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
          <Skeleton className='h-[400px] w-full rounded-lg' />
          <Skeleton className='mt-6 h-8 w-2/3' />
          <Skeleton className='mt-4 h-4 w-full' />
          <Skeleton className='mt-2 h-4 w-full' />
          <Skeleton className='mt-2 h-4 w-4/5' />
          <Skeleton className='mt-6 h-4 w-full' />
          <Skeleton className='mt-2 h-4 w-full' />
          <Skeleton className='mt-2 h-4 w-3/4' />
        </section>
      </div>
    </section>
  )
}
