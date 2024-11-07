'use client'

import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'

import { UserValidation } from '@/lib/validations/user'
import { useUploadThing } from '@/lib/uploadthing'
import { isBase64Image } from '@/lib/utils'
import { updateUser } from '@/lib/actions/user.actions'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, User } from '@geist-ui/icons'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

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

  const { startUpload } = useUploadThing('media')

  const [files, setFiles] = useState<File[]>([])

  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image ? user.image : '',
      name: user?.name ? user.name : '',
      username: user?.username ? user.username : '',
      bio: user?.bio ? user.bio : '',
    },
  })

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    // NOTE: Cannot connect to the server by default with UploadThing ***_tofix***
    try {
      const blob = values.profile_photo

      const hasImageChanged = isBase64Image(blob)
      if (hasImageChanged) {
        const imgRes = await startUpload(files)
        console.log('Upload reponse:', imgRes)

        if (imgRes && imgRes[0].url) {
          values.profile_photo = imgRes[0].url
        }

      }

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

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void

  ) => {
    e.preventDefault()

    const fileReader = new FileReader()

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setFiles(Array.from(e.target.files))

      if (!file.type.includes('image')) return

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || ''
        fieldChange(imageDataUrl)
      }

      fileReader.readAsDataURL(file)
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
                  {field.value ? (
                    <Image
                      src={field.value}
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
                    onChange={(e) => handleImage(e, field.onChange)}
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