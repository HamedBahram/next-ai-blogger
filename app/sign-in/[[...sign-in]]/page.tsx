import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <section className='py-24'>
      <div className='container flex max-w-3xl items-center justify-center'>
        <SignIn />
      </div>
    </section>
  )
}
