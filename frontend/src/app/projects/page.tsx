import Link from "next/link";
import BackgroundFX from "../../components/BackgroundFX";
import pageStyles from "../page.module.css";
import fxStyles from "../../components/BackgroundFX.module.css";

export default function ProjectsPage() {
  return (
    <main className={pageStyles.page}>
      <BackgroundFX className={pageStyles.fxWrapper} enableSnow enableVCR enableScanlines enableVignette enableWobbleY>
        <h1 className={`${fxStyles.centerText} ${fxStyles.rgbGlitch}`}>Projects</h1>

        {/* Placeholder list – replace with real links/cards later */}
        <ul className={fxStyles.subText} style={{ listStyle: "none", padding: 0, marginTop: "0.75rem", textAlign: "center" }}>
          <li>• Sidewalk — visual experiments with CRT/VCR effects</li>
          <li>• UI micro-interactions & performance demos</li>
          <li>• Small OSS utilities (coming soon)</li>
        </ul>

        <nav className={fxStyles.internalLinks} aria-label="Page links">
          <Link href="/" className={fxStyles.rgbGlitchLink}>Home</Link>
          <Link href="/about" className={fxStyles.rgbGlitchLink}>About</Link>
          <Link href="/projects" className={fxStyles.rgbGlitchLink}>Projects</Link>
        </nav>
      </BackgroundFX>
    </main>
  );
}
