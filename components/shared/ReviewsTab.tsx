import { fetchCommunityPosts } from '@/lib/actions/community'
import { fetchUserPosts } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import ReviewCard from '../cards/ReviewCard'


interface Result {
  name: string,
  id: string,
  image: string,
  reviews: {
    /* ***new */
    songTitle: string,
    artist: string,
    rating: number,
    image: string,
    /* ***new */
    _id: string,
    text: string,
    parentId: string | null,
    author: {
      name: string,
      image: string,
      id: string,
    },
    community: {
      id: string,
      name: string,
      image: string,
    } | null,
    createdAt: string,
    children: {
      author: {
        image: string,
      },
    }[],
  }[],
}


interface Props {
  currentUserId: string,
  accountId: string,
  accountType: string,
}

async function ReviewsTab({ currentUserId, accountId, accountType }: Props) {
  let result: Result

  if (accountType === 'Community') {
    result = await fetchCommunityPosts(accountId)
  } else {
    result = await fetchUserPosts(accountId)
  }
  if (!result) redirect('/')
  console.log(result.reviews)

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.reviews.map((review) => (
        <ReviewCard
          key={review._id}
          id={review._id}
          currentUserId={currentUserId}
          parentId={review.parentId}
          content={review.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                name: review.author.name,
                image: review.author.image,
                id: review.author.id,
              }
          }
          community={
            accountType === "Community"
              ? { name: result.name, id: result.id, image: result.image }
              : review.community
          }
          createdAt={review.createdAt}
          comments={review.children}
          songTitle={review.songTitle} // ***new***
          artist={review.artist}
          rating={review.rating}
          image={review.image}

        />
      ))}
    </section>
  )
}


export default ReviewsTab