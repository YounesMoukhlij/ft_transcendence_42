import React from 'react'
// import lgo from public/Logo_pong-1.png
const Logo = () => {
  return (
    <div className='w-15 h-15  absolute p-0 m-0'>
        <img src="/Logo_pong-2.png" alt="Logo" style={{ width: '60px', height: '60px', animation: 'spin 2s linear infinite' }} />
    </div>
  )
}

export default Logo