import { fetchUserPosts } from '@/lib/actions/user.actions'
import ReviewCard from '../cards/ReviewCard'
import { redirect } from 'next/navigation'
import { Repeat } from '@geist-ui/icons'

interface Result {
  name: string,
  id: string,
  image: string,
  reposts: {
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
    songTitle: string,
    artist: string,
    rating: number,
    image: string,
    likes: string[],
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
}

async function RepostsTab({ currentUserId, accountId }: Props) {
  let result: Result
  result = await fetchUserPosts(accountId)

  if (!result) redirect('/')

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.reposts.map((review) => (
        <div key={review._id} className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Repeat />
            <span>Reposted by</span>
            <span className="font-medium">{result.name}</span>
          </div>
          <ReviewCard
            id={review._id}
            currentUserId={currentUserId}
            parentId={review.parentId}
            content={review.text}
            author={review.author}
            community={review.community}
            createdAt={review.createdAt}
            comments={review.children}
            songTitle={review.songTitle}
            artist={review.artist}
            rating={review.rating}
            image={review.image}
            likes={review.likes}
          />
        </div>
      ))}
    </section>
  )
}

export default RepostsTab