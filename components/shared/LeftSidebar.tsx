'use client'
import Link from 'next/link'
import { LogOut } from '@geist-ui/icons'
import { sidebarLinks } from '@/constants'
import { SignedIn, SignOutButton, useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { ContactSupport } from './ContactSupport'

const LeftSidebar = () => {
  const user = useUser().user
  const pathname = usePathname()


  return (
    <section className='custom-scrollbar leftsidebar'>
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive = (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route
          const linkRoute = link.route === '/profile' ? `${link.route}/${user?.id}` : link.route // TODO: Add userId

          return (
            <Link
              key={link.label}
              href={linkRoute}
              className={`leftsidebar_link ${isActive ? 'bg-primary-500' : ''}`} // Active Color link
            >
              <link.icon color='white' size={24} />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          )
        })}
      </div>
      <div className="mt-6 px-6">
        <ContactSupport />
      </div>
      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton redirectUrl='/sign-in'>
            <div className="flex cursor-pointer gap-4 px-4">
              <LogOut size={24} color='white' />
              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>)
}

export default LeftSidebar