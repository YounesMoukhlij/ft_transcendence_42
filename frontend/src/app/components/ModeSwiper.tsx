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

export default function ModeSwiper()
{
    const router = useRouter();
    const modes = [
      { id: 1, title: "Game vs AI", description: "Play against computer", buttonname: "AI", image: "/robot.png", route: "/game/ai" },
      { id: 2, title: "Game vs Human", description: "Play with a friend", buttonname: "1 Versus 1", image: "/1vs1.png", route: "/game/human" },
      { id: 3, title: "Tournament", description: "Compete in a tournament", buttonname: "Tournament", image: "/tournament.png", route: "/game/tournament" },
    ];

    const handleClick = (route) => { router.push(route);   };

    return (
      <div className={styles.swiperContainer}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={200}
          effect="fade"
          slidesPerView={1}
          navigation
          speed={800}
          className={styles.swiper}
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
            <SwiperSlide key={mode.id} className={styles.slide}>
              <div className={styles.imageContainer}>
                <Image
                  src={mode.image}
                  alt={mode.title}
                  width={840}
                  height={450}
                  className={styles.image}
                  priority
                />
              </div>
              <div className={styles.textContainer}>
                  <button className={styles.button}  onClick={() => handleClick(mode.route)}>
                    {mode.buttonname}
                  </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
}
