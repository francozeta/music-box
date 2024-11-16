'use client'

import { useOrganization } from '@clerk/nextjs'
import * as z from 'zod'
import { createReview } from '@/lib/actions/review.actions'
import { ReviewValidation } from '@/lib/validations/review'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Calendar as CalendarIcon, Star, Upload } from 'lucide-react'
import { cn, convertBlobUrlToFile } from '@/lib/utils'
import { format } from 'date-fns'


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import Image from 'next/image'

import { uploadImage } from '@/lib/supabase/storage/client'


interface Props {
  userId: string
}


export default function PostReview({ userId }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { organization } = useOrganization()


  const [imageUrls, setImageUrls] = useState<string[]>([]);


  const form = useForm<z.infer<typeof ReviewValidation>>({
    resolver: zodResolver(ReviewValidation),
    defaultValues: {
      songTitle: '',
      artist: '',
      review: '',
      rating: 0,
      listenedBefore: false,
      dateListened: new Date(),
      accountId: userId,
      image: ''
    }
  })

  const { watch } = form

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)
      setImageUrls([imageUrl])
      form.setValue('image', imageUrl) // Set the image value in the form
    }
  }

  const onSubmit = async (values: z.infer<typeof ReviewValidation>) => {
    try {
      if (imageUrls.length === 0) {
        form.setError('image', { type: 'manual', message: 'Image is required' })
        return
      }

      const imageFile = await convertBlobUrlToFile(imageUrls[0])
      const { imageUrl, error } = await uploadImage({
        file: imageFile,
        bucket: 'images-musicbox'
      })

      if (error) {
        console.error('Error uploading image:', error)
        form.setError('image', { type: 'manual', message: 'Failed to upload image' })
        return
      }

      const result = await createReview({
        text: values.review,
        author: userId,
        communityId: organization ? organization.id : null,
        path: pathname,
        songTitle: values.songTitle,
        artist: values.artist,
        rating: values.rating,
        listenedBefore: values.listenedBefore,
        dateListened: values.dateListened,
        image: imageUrl,
      })

      console.log('Review creation result:', result)
      router.push('/')
    } catch (error) {
      console.error('Error creating review:', error)
    }
  }
  return (
    <Form {...form}>
      <form
        className="space-y-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-8 p-6 rounded-lg bg-zinc-900">
          <h1 className='text-white text-2xl font-bold'>Create Review</h1>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name='songTitle'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-zinc-300'>Song title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter song title" {...field} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='artist'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Artist Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter artist name" {...field} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='dateListened'
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-zinc-300">Date Listened</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-zinc-800 border-zinc-700 text-zinc-100",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span className='text-zinc-400'>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date: Date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='review'
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Review</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your review here..."
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 resize-none"
                    {...field}
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Rating</FormLabel>
                <FormControl>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star, index) => (
                      <Star
                        key={index}
                        className={cn(
                          "w-6 h-6 cursor-pointer",
                          star <= field.value ? "text-yellow-400 fill-yellow-400" : "text-zinc-600"
                        )}
                        onClick={() => field.onChange(star)}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="listenedBefore"
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                <FormControl>
                  <input
                    type="checkbox"
                    className='accent-zinc-300 bg-zinc-800 border-zinc-700'
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-zinc-300">
                  {"I've listened to this song before"}
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='image'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-zinc-300'>Upload Image</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:text-zinc-50"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    <Input
                      id="image-upload"
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={handleImageChange}
                    />
                    {imageUrls.length > 0 ? (
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={imageUrls[0]}
                          alt="Preview"
                          className="object-cover"
                          fill
                          {...field}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-zinc-700 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-zinc-400" />
                      </div>
                    )}
                    <span className="text-zinc-400 text-sm">
                      {imageUrls.length > 0 ? `${imageUrls.length} image(s) selected` : 'No file chosen'}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(imageUrls || watch('songTitle') || watch('artist') || watch('rating') > 0) && (
            <div className="mt-6">
              <h3 className="text-zinc-300 font-semibold mb-3">Song card preview:</h3>
              <div className="bg-zinc-800 p-4 rounded-lg flex items-center space-x-4">
                {imageUrls.map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    alt="Image preview"
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />
                ))}
                <div>
                  <h4 className="font-medium text-zinc-100">{watch('songTitle') || 'Song Title'}</h4>
                  <p className="text-sm text-zinc-400">{watch('artist') || 'Artist Name'}</p>
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= watch('rating')
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-zinc-600"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button type='submit' className='bg-[#877eff] hover:bg-[#7165ff] text-white w-full'>
            Post Review
          </Button>
        </div>
      </form>
    </Form>
  )
}

