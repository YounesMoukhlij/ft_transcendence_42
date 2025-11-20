'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import Image from 'next/image';
import styles from './modeswiper.module.css';
import { useRouter } from 'next/navigation';
import { useGameContext } from './GameContext';

export default function ModeSwiper()
{
    const router = useRouter();
    const { setGameMode } = useGameContext();

    const modes = [
      { id: 1, title: "Remote Game", description: "Play with a friend online", buttonname: "1v1 Remote", image: "/1v1.png", mode: 'remote-options' as const },
      { id: 2, title: "Game vs AI", description: "Play against computer", buttonname: "AI", image: "/robot.png", mode: 'ai' as const },
      { id: 3, title: "Game vs Human", description: "Play online", buttonname: "Tournament", image: "/tournament.png", mode: 'tournament' as const },
      { id: 4, title: "Game vs Human", description: "Play with a friend", buttonname: "1 Versus 1", image: "/1v1.png", mode: 'local' as const },
    ];

    const handleClick = (mode: 'ai' | 'local' | 'tournament' | 'remote' | 'remote-options') => {
      if (mode === 'ai') {
        setGameMode(mode);
        router.push('/game/customize');
      } else if (mode === 'local') {
        router.push('/game/versus-selection');
      } else if (mode === 'tournament') {
        setGameMode(mode);
        router.push('/game/tournament');
      }
      else if (mode === 'remote') {
        setGameMode(mode);
        router.push('/game/remote-customize');
      }
      else if (mode === 'remote-options') {
        setGameMode('remote');
        router.push('/game/remote-options');
      }
    };

    return (
      <div className="w-[75%] h-[55vh] rounded-3xl">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={200}
          effect="fade"
          slidesPerView={1}
          navigation
          speed={2000}
          className="h-full"
          loop={true}
          autoplay={{
              delay: 5500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
          }}
          fadeEffect={{
            crossFade: true
        }}
        >
          {modes.map((mode) => (
            <SwiperSlide key={mode.id} className="bg-black relative">
              <div className="w-full h-full">
                <Image
                  src={mode.image}
                  alt={mode.title}
                  width={840}
                  height={450}
                  className="absolute z-10 w-full h-full object-cover rounded-3xl opacity-70 border-2 border-white"
                  priority
                />
              </div>
              <div className="absolute inset-1 top-80 flex justify-center items-center bg-transparent z-50">
                <button
                  className="opacity-95 bg-black border-2 border-white rounded-lg w-[40%] h-[30%] md:w-[30%] md:h-[40%] hover:bg-white hover:text-black bg-black text-white text-xl font-bold cursor-pointer hover:scale-120 transition-all duration-900 animate-pulse hover:animate-none focus:scale-105 focus:ring-8 focus:ring-white/40"
                  onClick={() => handleClick(mode.mode)}
                >
                  {mode.buttonname}
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
}
