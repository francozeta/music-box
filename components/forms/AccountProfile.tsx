'use client'

import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'

import { UserValidation } from '@/lib/validations/user'
import { useUploadThing } from '@/lib/uploadthing'
import { convertBlobUrlToFile, isBase64Image } from '@/lib/utils'
import { updateUser } from '@/lib/actions/user.actions'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, User } from '@geist-ui/icons'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { uploadImage } from '@/lib/supabase/storage/client'

interface Props {
  user: {
    id: string,
    objectId: string,
    username: string,
    name: string,
    bio: string,
    image: string
  }
  btnTitle: string
}
const AccountProfile = ({ user, btnTitle }: Props) => {
  const router = useRouter()
  const pathname = usePathname()

  const [imageUrls, setimageUrls] = useState<string[]>([])

  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image ? user.image : '',
      name: user?.name ? user.name : '',
      username: user?.username ? user.username : '',
      bio: user?.bio ? user.bio : '',
    },
  })

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file))
      setimageUrls([...imageUrls, ...newImageUrls])
    }
  }

  const handleClickUploadImagesButton = async (): Promise<string[]> => {
    const urls: string[] = []
    for (const url of imageUrls) {
      const imageFile = await convertBlobUrlToFile(url)
      const { imageUrl, error } = await uploadImage({
        file: imageFile,
        bucket: 'images-musicbox'
      })
      if (error) {
        console.error('Error uploading image:', error)
        return []
      }
      urls.push(imageUrl)
    }
    console.log('Profile photo uploaded: ', urls)
    setimageUrls([]) // Reset after uploading
    return urls
  }

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    // NOTE: Using now Supabase Storage 
    try {
      const uploadedUrls = await handleClickUploadImagesButton()

      if (uploadedUrls.length === 0) {
        console.error('Error uploading images')
        return
      }

      values.profile_photo = uploadedUrls[0]

      // ***TODO*** Update user profile: DONE✅
      await updateUser({
        userId: user.id,
        username: values.username,
        name: values.name,
        bio: values.bio,
        image: values.profile_photo,
        path: pathname,
      })

      if (pathname === '/profile/edit') {
        router.back()
      } else {
        router.push('/')
      }
    } catch (err) {
      console.error('Error on onSubmit', err)
    }
  }

  return (
    <Form {...form}>
      <form
        className='flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center gap-4">
              <FormLabel className="relative cursor-pointer group">
                <div className="relative size-24">
                  {imageUrls.length > 0 ? (
                    <Image
                      src={imageUrls[0]}
                      alt="profile_icon"
                      fill
                      priority
                      className="rounded-full object-cover"
                      {...field}
                    />
                  ) : field.value ? (
                    <Image
                      src={field.value} // Show the current profile image if it exists and is not selected another image
                      alt="profile_icon"
                      fill
                      priority
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-24 rounded-full bg-muted flex items-center justify-center">
                      <User className="size-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </FormControl>
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus '
                  {...field}
                  maxLength={30}
                  minLength={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                  maxLength={30}
                  minLength={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  className='account-form_input no-focus resize-none'
                  {...field}
                  maxLength={1000}
                  minLength={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>
          {btnTitle}
        </Button>
      </form>
    </Form>
  )
}


export default AccountProfile