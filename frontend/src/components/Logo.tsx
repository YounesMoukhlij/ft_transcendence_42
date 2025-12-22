"use client"

import React from 'react'
// import lgo from public/Logo_pong-1.png
import Link from 'next/link'
const Logo = () => {
  return (
    <div className='w-20 h-15 flex  absolute items-center p-0 m-0'>
      <Link href='/' className='absolute top-2 left-2'>
        <img className='w-64 ' src="/Logo2.png" alt="Logo" />
      </Link>
    </div>
  )
}

export default Logo