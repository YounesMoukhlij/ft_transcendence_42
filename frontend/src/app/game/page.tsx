
'use client';
import ModeSwiper from "../components/ModeSwiper";
import styles from "./game.module.css";
import Image from "next/image";

export default function GamePage() {
  return (
    <div className={styles.pageContainer}>
      <ModeSwiper/>
    </div>
  );
}
