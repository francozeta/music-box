import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

interface CommentCardProps {
  id: string
  author: {
    name: string
    image: string
  }
  text: string
  createdAt: Date
}

export function CommentCard({ author, text, createdAt }: CommentCardProps) {
  return (
    <div className="flex gap-4 w-full mb-5">
      <div className="flex-shrink-0">
        <Image
          src={author.image}
          alt={`${author.name}'s profile`}
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-sm text-gray-200">{author.name}</p>
          <span className="text-sm text-gray-500">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
        </div>
        <p className="text-gray-200 text-sm">{text}</p>
      </div>
    </div>
  )
}
