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
import { useGameContext } from '../contexts/GameContext';

export default function ModeSwiper()
{
    const router = useRouter();
    const { setGameMode } = useGameContext();

    const modes = [
      { id: 1, title: "Game vs AI", description: "Play against computer", buttonname: "AI", image: "/robot.png", mode: 'ai' as const },
      { id: 2, title: "Game vs Human", description: "Play with a friend", buttonname: "1 Versus 1", image: "/1vs1.png", mode: 'local' as const },
    ];

    const handleClick = (mode: 'ai' | 'local') => {
      if (mode === 'ai') {
        setGameMode(mode);
        router.push('/game/customize');
      } else {
        // For 1 vs 1, go to sub-selection page
        router.push('/game/versus-selection');
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
          speed={800}
          className="h-full"
          loop={true}
          autoplay={{
              delay: 5000,
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
                  className="absolute z-10 w-full h-full object-cover rounded-3xl opacity-90 border-2 border-white"
                  priority
                />
              </div>
              <div className="absolute inset-1 top-80 flex justify-center items-center bg-transparent z-50">
                <button
                  className="opacity-95 bg-black border-2 border-white rounded-lg w-[40%] h-[30%] md:w-[30%] md:h-[40%] hover:bg-white hover:text-black bg-black text-white text-xl font-bold cursor-pointer hover:scale-110 transition-all duration-300"
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
