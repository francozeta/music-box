import PostReview from '@/components/forms/PostReview';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "Create review",
}

async function Page() {
  const user = await currentUser()
  if (!user) return null



  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  return (
    <PostReview userId={userInfo._id.toString()} />
  )
}

export default Page;