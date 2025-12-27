import React from 'react'
import Auth from './app/(auth)/layout'
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