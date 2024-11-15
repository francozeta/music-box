import AccountProfile from '@/components/forms/AccountProfile'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

async function Page() {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (userInfo?.onboarded) redirect("/");

  const userData = {
    id: user.id,
    objectId: userInfo?._id.toString() ?? '',
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  }
  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-center items-center min-h-screen px-10 py-20'>
      <h1 className='head-text text-center'>Onboarding</h1>
      <p className='mt-3 text-base-regular text-light-2 text-center'>
        Complete your profile now, to use MusicBox.
      </p>

      <section className='mt-9 bg-dark-2 p-10 w-full max-w-lg border border-zinc-800 rounded-xl'>
        <AccountProfile
          user={userData}
          btnTitle='continue'
        />
      </section>
    </main>
  )
}

export default Page