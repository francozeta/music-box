import { fetchUser, getActivity } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "Activity",
}

async function Page() {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)

  if (!userInfo?.onboarded) redirect('/')

  const activity = await getActivity(userInfo._id)

  return (
    <>
      <h1 className='head-text'>Activity</h1>

      <section className='mt-10 flex flex-col gap-5'>
        {activity.length > 0 ? (
          <>
            {activity.map((activity: any, index) => (
              <Link key={`${activity.reviewId}-${index}`} href={`/review/${activity.reviewId}`} className='block'>
                <article className='activity-card'>
                  <div className="flex items-center gap-3">
                    <Image
                      src={activity.author.image}
                      alt='user_logo'
                      width={20}
                      height={20}
                      className='rounded-full object-cover'
                    />
                    <p className='!text-small-regular text-light-1'>
                      <span className='mr-1 text-primary-500'>
                        {activity.author.name}
                      </span>{" "}
                      {activity.type === 'reply' && 'replied to your review'}
                      {activity.type === 'like' && 'liked your review'}
                      {activity.type === 'repost' && 'reposted your review'}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className='!text-base-regular text-light-3'>No activity yet</p>
        )}
      </section>
    </>
  )
}

export default Page