"use client"

import React from 'react'

import { SideBarLinks } from '@/constants'
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import Image from 'next/image';

const Sidebar = () => {

  const pathname = usePathname();

  return (
    <section className='sticky top-0 left-0 flex flex-col h-screen w-fit justify-between bg-dark-1 p-6 pt-28 text-white
    max-sm:hidden lg:w-[264px]'>
          <div className='flex flex-1 flex-col gap-6'>
              {
                SideBarLinks.map((link)=>{
                  const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`);
                  return (
                      <Link
                      href={link.route}
                      key={link.label}
                      className={cn('flex gap-4 items-center p-4 rounded-lg justify-start',{
                        'bg-blue-1': isActive,
                      })}>
                          <Image
                          src={link.imgUrl}
                          alt={link.label}
                          width={24}
                          height={24}
                          />
                          <p className='text-lg font-semibold max-lg:hidden'>
                            {link.label}
                          </p>
                      </Link>
                  )
                })
              }
          </div>
    </section>
  )
}

export default Sidebar
