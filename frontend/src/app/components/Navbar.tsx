
import styles from './navbar.module.css';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
        <div className={styles.container}>
            <div className={styles.leftSection}>
                <Image className={styles.Logoimg} src="/logo.png" alt="logo" width={100} height={100}/>
            </div>
            <div className={styles.rightSection}>
                <div className={styles.imgGrp}>
                    <Image className={styles.img} src="/search.png" alt="search" width={100} height={100} />
                </div>
                <div className={styles.imgGrp}>
                    <Image className={styles.img} src="/ringing.png" alt="notification" width={100} height={100} />
                </div>
                <div className={styles.imgGrp}>
                    <Image className={styles.img} src="/profileface.png" alt="profileface" width={100} height={100} />
                </div>
            </div>
        </div>
    </nav>
  );
}
