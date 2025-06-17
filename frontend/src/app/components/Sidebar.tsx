'use client';

import styles from './sidebar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar()
{
  const pathname = usePathname();
  const navItems = [
    { path: '/game', icon: '/games.png', alt: 'Game icon' },
    { path: '/chat', icon: '/chat.png', alt: 'Chat icon' },
    { path: '/profile', icon: '/user.png', alt: 'Profile icon' },
    { path: '/settings', icon: '/settings.png', alt: 'Settings icon' },
  ];
  return(
    <aside className={styles.sidebar}>
      <div className={styles.container}>
        {navItems.map((item) => (
          <Link href={item.path} key={item.path}  className={`${styles.imgGrp} ${pathname === item.path ? styles.active : ''}`}>
            <Image
              src={item.icon}
              alt={item.alt}
              width={24}
              height={24}
              className={styles.img}
            />
          </Link>
        ))}
      </div>
    </aside>
    );
}
