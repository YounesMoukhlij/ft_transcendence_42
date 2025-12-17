import React from 'react'
import Profile from './app/(protected)/profile/page'
import Auth from './app/(auth)/layout'
import { redirect } from 'next/dist/server/api-utils'
const page = () => {
    window.location.href = '/signIn'
    // redirect('/signIn')
  return (
    <div>
      {/* <Profile /> */}
      <Auth />
    </div>
  )
}

export default page