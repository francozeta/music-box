'use client'

import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'

import { UserValidation } from '@/lib/validations/user'
import { convertBlobUrlToFile } from '@/lib/utils'
import { updateUser } from '@/lib/actions/user.actions'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@geist-ui/icons'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { uploadImage } from '@/lib/supabase/storage/client'

//New Update Clerk Profile Image
import { useUser } from '@clerk/nextjs'

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

  //New Update Clerk Profile Image
  const { user: clerkUser } = useUser()


  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image ? user.image : '',
      name: user?.name ? user.name : '',
      username: user?.username ? user.username : '',
      bio: user?.bio ? user.bio : '',
    },
  })

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)
      setimageUrls([imageUrl])

      // Update Clerk user's profile image
      try {
        const formData = new FormData()
        formData.append('file', file)
        await clerkUser?.setProfileImage({ file })
        console.log('Profile image updated in Clerk')
      } catch (error) {
        console.error('Error updating profile image in Clerk:', error)
      }
    }
  }

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    try {
      let profileImageUrl = values.profile_photo

      if (imageUrls.length > 0) {
        const imageFile = await convertBlobUrlToFile(imageUrls[0])
        const { imageUrl, error } = await uploadImage({
          file: imageFile,
          bucket: 'images-musicbox'
        })
        if (error) {
          console.error('Error uploading image:', error)
          return
        }
        profileImageUrl = imageUrl
      }

      try {
        await clerkUser?.update({ username: values.username })
        console.log('Username updated in Clerk!')
      } catch (err) {
        console.error('Error updating username in Clerk:', err)
      }

      await updateUser({
        userId: user.id,
        username: values.username,
        name: values.name,
        bio: values.bio,
        image: profileImageUrl,
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