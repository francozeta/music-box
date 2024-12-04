'use client'

import { sidebarLinks } from '@/constants'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Botttombar = () => {
  const pathname = usePathname()
  const user = useUser().user
  return (
    <section className='bottombar'>
      <div className="bottombar_container">
        {sidebarLinks.map(link => {
          const isActive = (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route
          const linkRoute = link.route === '/profile' ? `${link.route}/${user?.id}` : link.route // TODO: Add userId

          return (
            <Link
              key={link.label}
              href={linkRoute}
              className={`bottombar_link ${isActive && 'bg-primary-500'}`}
            >
              <link.icon size={24} color='white' />
              <p className='text-subtle-medium text-light-1 max-sm:hidden'>
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default Botttombar