'use client'

import { sidebarLinks } from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Botttombar = () => {
  const pathname = usePathname()
  return (
    <section className='bottombar'>
    <div className="bottombar_container">
      {sidebarLinks.map(link => {
        const isActive = (pathname.includes(link.route) && link.route.length > 1) ||
          pathname === link.route

        return (
          <Link
            key={link.label}
            href={link.route}
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