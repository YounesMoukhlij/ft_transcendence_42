// 'use client'
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// function FlyingSaucer() {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // Generate consistent random values only on client
//   const getParticleAnimation = (index: number) => {
//     if (!isClient) {
//       return {
//         initial: { x: 200, y: 300, opacity: 0 },
//         animate: { x: [200, 250, 200], y: [300, 250, 300], opacity: [0, 0.9, 0],
//            scale: [0.5, 1.5, 0.5] }
//       };
//     }

//     // Use index as seed for more predictable but varied results
//     const seed1 = (index * 17) % 100;
//     const seed2 = (index * 23) % 100; 
//     const seed3 = (index * 31) % 100;
    
//     return {
//       initial: {
//         x: (seed1 / 100) * 400 + 100,
//         y: (seed2 / 100) * 300 + 200,
//         opacity: 0,
//       },
//       animate: {
//         x: [
//           (seed1 / 100) * 400 + 100,
//           (seed2 / 100) * 500 + 50,
//           (seed3 / 100) * 400 + 100
//         ],
//         y: [
//           (seed2 / 100) * 300 + 200,
//           (seed3 / 100) * 200 + 150,
//           (seed1 / 100) * 300 + 200
//         ],
//         opacity: [0, 0.9, 0],
//         scale: [0.5, 1.5, 0.5]
//       }
//     };
//   };

//   return (
//     <div className="absolute left-0 top-0 w-full h-full pointer-events-none overflow-hidden">
//       {/* Main Big UFO */}
//       <motion.div
//         className="absolute"
//         initial={{ 
//           x: "15vw", 
//           y: "50vh",
//           rotate: 0 
//         }}
//         animate={{ 
//           x: ["15vw", "25vw", "10vw", "20vw", "15vw"],
//           y: ["50vh", "35vh", "60vh", "40vh", "50vh"],
//           rotate: [0, -10, 5, -5, 0]
//         }}
//         transition={{
//           duration: 20,
//           repeat: Infinity,
//           ease: "easeInOut",
//           times: [0, 0.25, 0.5, 0.75, 1]
//         }}
//       >
//         {/* UFO Body */}
//         <div className="relative">
//           {/* Main large disc */}
//           <motion.div
//             className="w-80 h-32 bg-gradient-to-b from-gray-200 via-gray-400 to-gray-700 rounded-full relative shadow-2xl border border-gray-500"
//             animate={{
//               scale: [1, 1.02, 1],
//             }}
//             transition={{
//               duration: 4,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//             style={{
//               background: 'linear-gradient(to bottom, #e5e7eb 0%, #9ca3af 30%, #6b7280 70%, #374151 100%)',
//               boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 -5px 15px rgba(0, 0, 0, 0.3)'
//             }}
//           >
//             {/* Top dome */}
//             <div 
//               className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-48 h-24 rounded-full shadow-xl"
//               style={{
//                 background: 'linear-gradient(to bottom, #f3f4f6 0%, #d1d5db 50%, #9ca3af 100%)',
//                 boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4), inset 0 -3px 10px rgba(0, 0, 0, 0.2)'
//               }}
//             ></div>
            
//             {/* Large windows around the dome */}
//             <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-6">
//               <motion.div 
//                 className="w-6 h-6 bg-cyan-300 rounded-full shadow-lg"
//                 animate={{
//                   opacity: [0.4, 1, 0.4],
//                   boxShadow: [
//                     "0 0 10px rgba(0, 255, 255, 0.4)",
//                     "0 0 25px rgba(0, 255, 255, 1)",
//                     "0 0 10px rgba(0, 255, 255, 0.4)"
//                   ]
//                 }}
//                 transition={{
//                   duration: 2,
//                   repeat: Infinity,
//                   ease: "easeInOut"
//                 }}
//               ></motion.div>
//               <motion.div 
//                 className="w-6 h-6 bg-cyan-300 rounded-full shadow-lg"
//                 animate={{
//                   opacity: [1, 0.4, 1],
//                   boxShadow: [
//                     "0 0 25px rgba(0, 255, 255, 1)",
//                     "0 0 10px rgba(0, 255, 255, 0.4)",
//                     "0 0 25px rgba(0, 255, 255, 1)"
//                   ]
//                 }}
//                 transition={{
//                   duration: 2,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                   delay: 0.4
//                 }}
//               ></motion.div>
//               <motion.div 
//                 className="w-6 h-6 bg-cyan-300 rounded-full shadow-lg"
//                 animate={{
//                   opacity: [0.4, 1, 0.4],
//                   boxShadow: [
//                     "0 0 10px rgba(0, 255, 255, 0.4)",
//                     "0 0 25px rgba(0, 255, 255, 1)",
//                     "0 0 10px rgba(0, 255, 255, 0.4)"
//                   ]
//                 }}
//                 transition={{
//                   duration: 2,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                   delay: 0.8
//                 }}
//               ></motion.div>
//               <motion.div 
//                 className="w-6 h-6 bg-cyan-300 rounded-full shadow-lg"
//                 animate={{
//                   opacity: [1, 0.4, 1],
//                   boxShadow: [
//                     "0 0 25px rgba(0, 255, 255, 1)",
//                     "0 0 10px rgba(0, 255, 255, 0.4)",
//                     "0 0 25px rgba(0, 255, 255, 1)"
//                   ]
//                 }}
//                 transition={{
//                   duration: 2,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                   delay: 1.2
//                 }}
//               ></motion.div>
//             </div>

//             {/* Bottom lights array */}
//             <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-4">
//               {[...Array(8)].map((_, i) => (
//                 <motion.div 
//                   key={i}
//                   className="w-3 h-3 bg-yellow-300 rounded-full"
//                   animate={{
//                     opacity: [0.2, 1, 0.2],
//                     scale: [0.7, 1.3, 0.7],
//                     boxShadow: [
//                       "0 0 8px rgba(255, 255, 0, 0.3)",
//                       "0 0 20px rgba(255, 255, 0, 1)",
//                       "0 0 8px rgba(255, 255, 0, 0.3)"
//                     ]
//                   }}
//                   transition={{
//                     duration: 1.2,
//                     repeat: Infinity,
//                     ease: "easeInOut",
//                     delay: i * 0.15
//                   }}
//                 ></motion.div>
//               ))}
//             </div>

//             {/* Side detail rings */}
//             <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-4 h-8 bg-gradient-to-b from-gray-500 to-gray-700 rounded-full opacity-60"></div>
//             <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-4 h-8 bg-gradient-to-b from-gray-500 to-gray-700 rounded-full opacity-60"></div>
//           </motion.div>

//           {/* Large tractor beam effect */}
//           <motion.div
//             className="absolute top-full left-1/2 transform -translate-x-1/2"
//             style={{
//               width: 0,
//               height: 0,
//               borderLeft: '60px solid transparent',
//               borderRight: '60px solid transparent',
//               borderTop: '80px solid rgba(0, 255, 255, 0.08)',
//             }}
//             animate={{
//               opacity: [0, 0.7, 0],
//               scaleY: [0.3, 1, 0.3],
//               scaleX: [0.6, 1.4, 0.6]
//             }}
//             transition={{
//               duration: 3,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//           ></motion.div>

//           {/* Secondary beam layer */}
//           <motion.div
//             className="absolute top-full left-1/2 transform -translate-x-1/2"
//             style={{
//               width: 0,
//               height: 0,
//               borderLeft: '40px solid transparent',
//               borderRight: '40px solid transparent',
//               borderTop: '60px solid rgba(255, 255, 255, 0.05)',
//             }}
//             animate={{
//               opacity: [0, 0.5, 0],
//               scaleY: [0.5, 1.2, 0.5],
//               scaleX: [0.8, 1.2, 0.8]
//             }}
//             transition={{
//               duration: 3,
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: 0.5
//             }}
//           ></motion.div>
//         </div>
//       </motion.div>

//       {/* Enhanced floating energy particles - Only render on client */}
//       {/* {isClient && [...Array(12)].map((_, i) => {
//         const animation = getParticleAnimation(i);
//         return (
//           <motion.div
//             key={i}
//             className="absolute w-2 h-2 bg-cyan-300 rounded-full"
//             style={{
//               boxShadow: '0 0 8px rgba(0, 255, 255, 0.8)'
//             }}
//             initial={animation.initial}
//             animate={animation.animate}
//             transition={{
//               duration: 8 + (i % 6),  // Use index for variation
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: i * 0.5
//             }}
//           />
//         );
//       })} */}

//       {/* Ambient glow effect around UFO area */}
//       <motion.div
//         className="absolute"
//         initial={{
//           x: "20vw",
//           y: "50vh"
//         }}
//         animate={{
//           x: ["20vw", "30vw", "15vw", "25vw", "20vw"],
//           y: ["50vh", "35vh", "60vh", "40vh", "50vh"]
//         }}
//         transition={{
//           duration: 20,
//           repeat: Infinity,
//           ease: "easeInOut",
//           times: [0, 0.25, 0.5, 0.75, 1]
//         }}
//       >
//         <motion.div
//           className="w-96 h-96 rounded-full"
//           style={{
//             background: 'radial-gradient(circle, rgba(0, 255, 255, 0.03) 0%, transparent 70%)'
//           }}
//           animate={{
//             scale: [1, 1.2, 1],
//             opacity: [0.3, 0.6, 0.3]
//           }}
//           transition={{
//             duration: 6,
//             repeat: Infinity,
//             ease: "easeInOut"
//           }}
//         ></motion.div>
//       </motion.div>
//     </div>
//   );
// }

// export default function Fly() {
//   return (
//     <div className="  w-100 h-100 border border-emerald-300 relative">
//       <FlyingSaucer className="scale-50 top-[-100%]" />
//     </div>
//   );
// }
'use client'

import React from 'react'

const page = () => {
  const handlelogout=()=>{
    console.log("logout")
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