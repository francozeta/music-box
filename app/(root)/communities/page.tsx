import CommunityCard from '@/components/cards/CommunityCard';
import Pagination from '@/components/shared/Pagination';
import Searchbar from '@/components/shared/Searchbar';
import { fetchCommunities } from '@/lib/actions/community';
import { fetchUser } from '@/lib/actions/user.actions';
import { OrganizationSwitcher } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';


async function Page({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchCommunities({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  return (
    <>
      <div className="flex justify-between">
        <h1 className='head-text'>Communities</h1>
        <OrganizationSwitcher />
      </div>

      <div className='mt-5'>
        <Searchbar routeType='communities' />
      </div>

      <section className='mt-9 flex flex-wrap gap-4'>
        {result.communities.length === 0 ? (
          <p className='text-zinc-400'>No result</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path='communities'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  )
}

export default Page