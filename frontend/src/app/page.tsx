"use client";

import Image from "next/image";
import BackgroundFX from "../components/BackgroundFX";
import pageStyles from "./page.module.css";
import styles from "../components/BackgroundFX.module.css";

export default function Home() {
  return (
    <main className={pageStyles.page}>
      <BackgroundFX
        className={pageStyles.fxWrapper}
        enableSnow
        enableVCR
        enableScanlines
        enableVignette
        enableWobbleY
      >
        {/* Title */}
        <h1 className={`${styles.centerText} ${styles.rgbGlitch}`}>Ezekiel</h1>

        {/* Social icons with RGB glow */}
        <div className={styles.socialLinks}>
          <a
            href="https://github.com/EzekielBrown"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Image
              className={styles.rgbGlitchIcon}
              src="/icons/github.svg"
              alt="GitHub"
              width={32}
              height={32}
              priority
            />
          </a>
          <a
            href="https://www.linkedin.com/in/ezekiel-brown-a3995a217/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Image
              className={styles.rgbGlitchIcon}
              src="/icons/linkedin.svg"
              alt="LinkedIn"
              width={32}
              height={32}
              priority
            />
          </a>
          <a
            href="https://www.instagram.com/zekbrown"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Image
              className={styles.rgbGlitchIcon}
              src="/icons/instagram.svg"
              alt="Instagram"
              width={32}
              height={32}
              priority
            />
          </a>
        </div>
      </BackgroundFX>
    </main>
  );
}
