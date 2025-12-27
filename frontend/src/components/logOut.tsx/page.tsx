import React from 'react'

const page = () => {
    const handlelogout=()=>{
        alert("logout")
        // clear local storage
        localStorage.clear();
        //  clear cookies
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
      }
      return (
        <div className='flex justify-center items-center h-screen bg-gray-100 hover:cursor-ew-resize'>
              <button className='bg-red-500 text-white px-4 py-2 rounded'
               onClick={handlelogout}>Logout</button>
    
        </div>
        )
}

export default page