'use client'
import { CommentValidation } from '@/lib/validations/review'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { addCommentToReview } from '@/lib/actions/review.actions'
import Image from 'next/image'
import { Input } from '../ui/input'
import { Button } from '../ui/button'


interface Props {
  reviewId: string,
  currentUserImg: string,
  currenUserId: string,
}

function Comment({ reviewId, currentUserImg, currenUserId }: Props) {
  const pathname = usePathname()

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      review: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToReview(
      reviewId,
      values.review,
      JSON.parse(currenUserId),
      pathname
    )
    form.reset()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      form.handleSubmit(onSubmit)()
    }
  }

  return (
    <Form {...form}>
      <form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='review'
          render={({ field }) => (
            <FormItem className='flex w-full items-center gap-3'>
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt='Current user image'
                  width={48}
                  height={48}
                  className='rounded-full object-cover'
                />
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input
                  type='text'
                  {...field}
                  placeholder='Add a comment...'
                  className='no-focus text-light-1 outline-none'
                  onKeyDown={handleKeyDown}
                  autoCorrect='off'
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type='submit' className='comment-form_btn'>
          Reply
        </Button>
      </form>
    </Form>
  )
}

export default Comment
