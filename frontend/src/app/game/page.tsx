
'use client';
import styles from "./game.module.css";
import Image from "next/image";

export default function GamePage() {
  return (
    <main className={styles.pageContainer}>
      <div className={styles.gameContainer}>
        <div className={styles.gameHeader}>
          <div className={styles.gameUser}>
            <Image src="/profileface.png" alt="User Profile" width={80} height={80} />
            <h1>Youmoukh</h1>
          </div>
          <div className={styles.gameUser}>
            <h1>Zakaria</h1>
            <Image src="/profileface.png" alt="User Profile" width={80} height={80} />
          </div>
        </div>

        <div className={styles.playGround}>

          <div className={styles.left}>left</div>
          <div className={styles.right}>right</div>
        </div>
      </div>
    </main>
  );
}
