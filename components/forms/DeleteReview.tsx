'use client'

import { usePathname, useRouter } from 'next/navigation'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { Trash2 } from '@geist-ui/icons'
import { deleteReview } from '@/lib/actions/review.actions'

interface Props {
  reviewId: string,
  currentUserId: string,
  authorId: string,
  parentId: string | null
}

function DeleteReview({
  reviewId,
  currentUserId,
  authorId,
  parentId
}: Props) {
  const pathname = usePathname()
  const router = useRouter()

  if (currentUserId !== authorId) return null /* || pathname === '/' */

  const handleDelete = async () => {
    try {
      await deleteReview(JSON.parse(reviewId), pathname)
      if (!parentId) router.push('/')
        
    } catch (err) {
      console.error('Error deleting review: ', err)
    }
  }


  return (
    <DropdownMenuItem className='text-red-500 cursor-pointer' onClick={handleDelete}>
      <Trash2 />
      Delete
    </DropdownMenuItem>
  )
}

export default DeleteReview