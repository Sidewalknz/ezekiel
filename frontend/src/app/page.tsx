"use client";

import Image from "next/image";
import Link from "next/link";
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
        {/* Top nav (pinned, same spot on all pages) */}
        <nav className={styles.internalLinks} aria-label="Site">
          <Link href="/" className={styles.rgbGlitchLink}>
            Home
          </Link>
          <Link href="/about" className={styles.rgbGlitchLink}>
            About
          </Link>
          <Link href="/projects" className={styles.rgbGlitchLink}>
            Projects
          </Link>
        </nav>

        {/* Title */}
        <h1 className={`${styles.centerText} ${styles.rgbGlitch}`}>Ezekiel</h1>

        {/* Social icons */}
        <div className={styles.socialLinks} aria-label="Social">
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
