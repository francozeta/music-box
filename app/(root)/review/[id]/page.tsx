import ReviewCard from '@/components/cards/ReviewCard'
import Comment from '@/components/forms/Comment'
import { fetchReviewById } from '@/lib/actions/review.actions'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'
import { redirect } from 'next/navigation'

async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  if (!params.id) return null

  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')

  const review = await fetchReviewById(params.id)


  return (
    <section className='relative' >
      <div>
        <ReviewCard
          key={review._id}
          id={review._id.toString()}
          currentUserId={user.id}
          parentId={review.parentId}
          content={review.text}
          author={review.author}
          community={review.community}
          createdAt={review.createdAt}
          comments={review.children}
          songTitle={review.songTitle} // ***new***
          artist={review.artist}
          rating={review.rating}
          image={review.image}

        />
      </div>

      <div className="mt-7">
        <Comment
          reviewId={params.id}
          currentUserImg={user.imageUrl}
          currenUserId={JSON.stringify(userInfo._id)}
        />
      </div>

    {/* // TODO: INTERFACE CommentChildItem */}
      <div className="mt-10">
        {review.children.map((childItem: any) => (
          <>
            <div
              key={childItem._id}
            >
              <Image
                src={childItem.author.image}
                alt='Review image'
                width={120}
                height={120}
              />
              <p>{childItem.text}</p>
            </div>
            <div>
              <p>{childItem.author.name}</p>
            </div>
          </>
        ))}
      </div>
    </section>
  )
}

export default Page