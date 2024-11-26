import ProfileHeader from '@/components/shared/ProfileHeader';
import RepostsTab from '@/components/shared/RepostsTab';
import ReviewsTab from '@/components/shared/ReviewsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';


async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(params.id)
  if (!userInfo?.onboarded) redirect('/onboarding')


  console.log('CURREN USER ID: PAGE/PROFILE/[ID]: ', user.id)
  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue='reviews' className='w-full'>
          <TabsList className='tab'>
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <tab.icon size={24} color='gray' />
                <p className='max-sm:hidden'>{tab.label}</p>
                {tab.label === 'Reviews' && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {userInfo.reviews.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent key={`content-${tab.label}`} value={tab.value} className='w-full text-light-1'>
              {tab.value === 'reviews' && (
                <ReviewsTab currentUserId={user.id} accountId={userInfo.id} accountType='User' />
              )}
              {tab.value === 'replies' && (
                <ReviewsTab currentUserId={user.id} accountId={userInfo.id} accountType='User' />
              )}
              {tab.value === 'reposts' && (
                <RepostsTab currentUserId={user.id} accountId={userInfo.id} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>

  )
}

export default Page