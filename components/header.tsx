import Link from 'next/link'
import Logo from '@/components/logo'

export default function Header() {
  return (
    <header className='py-6'>
      <div className='container flex max-w-3xl items-center justify-between'>
        <Link href='/'>
          <Logo />
        </Link>
        <button>Sign in </button>
      </div>
    </header>
  )
}
