import { fetchUsers } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import UserCard from '../cards/UserCard'

const RightSidebar = async () => {
  const user = await currentUser()
  if (!user) return null


  const similarMinds = await fetchUsers({
    userId: user.id,
    pageSize: 6,
  })
  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className='text-heading-4-medium text-light-1'>
          Similar Reviewers
        </h3>
        <div className="mt-7 flex w-[350px] flex-col gap-10">
          {similarMinds.users.length > 0 ? (
            <>
              {similarMinds.users.map((person) => (
                <UserCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.image}
                  personType='User'
                />
              ))}
            </>
          ) : (
            <p className='!text-base-regular text-light-3'>No users yet</p>
          )}
        </div>
      </div>
    </section>)
}

export default RightSidebar