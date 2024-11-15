import ReviewCard from '@/components/cards/ReviewCard';
import { fetchPosts } from '@/lib/actions/review.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';

import { redirect } from 'next/navigation';

export default async function Home(
  props: {
    searchParams: Promise<{ [key: string]: string | undefined }>
  }
) {
  const searchParams = await props.searchParams;

  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')

  const result = await fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    30
  )


  return (
    <>
      <h1 className='head-text text-left'>Home</h1>
      <section className='mt-9 flex flex-col gap-10'>
        {result.posts.length === 0 ? (
          <p className="no-result">No reviews found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ReviewCard
                key={post._id}
                id={post._id.toString()}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                songTitle={post.songTitle} // ***new***
                artist={post.artist}
                rating={post.rating}
                image={post.image}

              />
            ))}
          </>
        )}
      </section>
      {/* ***Pagination *** */}

    </>

  );
}
