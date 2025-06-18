'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './navbar.module.css';
import Image from 'next/image';

export default function Navbar()
{
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);



  // khlit lhadchi llah

  // nb9aw khdamin f lkher nmss7o kulchi

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Image className={styles.Logoimg} src="/logo.png" alt="logo" width={80} height={80}/>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.imgGrp}>
            <Image className={styles.img} src="/search.png" alt="search" width={80} height={80} />
          </div>
          <div className={styles.imgGrp}>
            <Image className={styles.img} src="/ringing.png" alt="notification" width={80} height={80} />
          </div>
          <div className={styles.imgGrp} ref={dropdownRef}>
            <Image
              className={styles.img}
              src="/profileface.png"
              alt="profileface"
              width={80}
              height={80}
              onClick={toggleDropdown}
              style={{ cursor: 'pointer' }}
            />

            {isOpen && (
              <div className={styles.dropdownMenu}>
                <ul>
                  <li><a href="/profile">My Profile</a></li>
                  <li><a href="/settings">Settings</a></li>
                  <li><a href="/logout">Dir chi kharya a la7yaaa</a></li>
                  <li><a href="/logout">Logout</a></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
