"use client";

import { useState } from "react";
import Link from "next/link";
import BackgroundFX from "../../components/BackgroundFX";
import pageStyles from "../page.module.css";
import fxStyles from "../../components/BackgroundFX.module.css";

type TabKey = "about" | "education" | "work";

const TABS: { key: TabKey; label: string }[] = [
  { key: "about", label: "About Me" },
  { key: "education", label: "Education" },
  { key: "work", label: "Previous Work" },
];

export default function AboutPage() {
  const [tab, setTab] = useState<TabKey>("about");

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
        {/* Shared nav across pages */}
        <nav className={fxStyles.internalLinks} aria-label="Site">
          <Link href="/" className={fxStyles.rgbGlitchLink}>
            Home
          </Link>
          <Link href="/about" className={fxStyles.rgbGlitchLink}>
            About
          </Link>
          <Link href="/projects" className={fxStyles.rgbGlitchLink}>
            Projects
          </Link>
        </nav>

        {/* Title */}
        <h1 className={`${fxStyles.centerText} ${fxStyles.rgbGlitch}`}>About</h1>

        {/* Tab links (styled like nav) */}
        <div className={fxStyles.tabBar} role="tablist" aria-label="About sections">
          {TABS.map(({ key, label }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${key}`}
                id={`tab-${key}`}
                className={`${fxStyles.rgbGlitchLink} ${fxStyles.tabLinkButton} ${
                  active ? fxStyles.tabLinkActive : ""
                }`}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Panels */}
        <section
          id="panel-about"
          role="tabpanel"
          aria-labelledby="tab-about"
          hidden={tab !== "about"}
          className={fxStyles.panel}
        >
          <div className={fxStyles.panelBody}>
            <p>
              Kia ora! I’m Ezekiel! I’m currently wrapping up my master’s in
              Artificial Intelligence at Victoria University of Wellington.
              Based in Nelson, I’m all about technology, whether it’s diving
              into video games or building my own mobile apps. I’m a big sports
              fan, especially football, F1, and basketball. Lately, I’ve been
              tinkering with Guitar Hero and Rock Band controllers, gutting the
              internals, swapping parts, and spray painting custom faceplates.
            </p>
          </div>
        </section>

        <section
          id="panel-education"
          role="tabpanel"
          aria-labelledby="tab-education"
          hidden={tab !== "education"}
          className={fxStyles.panel}
        >
          <div className={fxStyles.panelBody}>
            {/* Master */}
            <div className={fxStyles.sectionBlock}>
              <h2>Master of Artificial Intelligence</h2>
              <p className={fxStyles.cardMeta}>2024 – Present</p>
              <p>
                Currently studying at Te Herenga Waka — Victoria University of
                Wellington, focusing on machine learning and natural language
                processing. For my final project, I was tasked with predicting the
                feed conversion ratio in King salmon, developing multiple machine
                learning models and pre-processing data.
              </p>
              <p className={fxStyles.badgeRow}>
                <span className={fxStyles.badge}>Machine Learning</span>
                <span className={fxStyles.badge}>DEAP</span>
                <span className={fxStyles.badge}>Scikit-Learn</span>
                <span className={fxStyles.badge}>Genetic Programming</span>
              </p>
            </div>

            {/* Bachelor */}
            <div className={fxStyles.sectionBlock}>
              <h2>Bachelor of Information Technology</h2>
              <p className={fxStyles.cardMeta}>2020 – 2023</p>
              <p>
                A 1-year diploma evolved into a three-year bachelor’s at Nelson
                Marlborough Institute of Technology (NMIT). I developed core
                software, hardware, database, and web skills. I also explored CGI,
                creating worlds and stories in Unreal Engine. My final-year
                project predicted salmon health using AI—entirely self-guided,
                and I topped my class for it.
              </p>
              <p className={fxStyles.badgeRow}>
                <span className={fxStyles.badge}>Full-Stack Web</span>
                <span className={fxStyles.badge}>Databases</span>
                <span className={fxStyles.badge}>Software Engineering</span>
                <span className={fxStyles.badge}>Data Analysis</span>
                <span className={fxStyles.badge}>Unreal Engine 5</span>
              </p>
            </div>

            {/* Diploma */}
            <div className={fxStyles.sectionBlock}>
              <h2>Diploma of Web Development</h2>
              <p className={fxStyles.cardMeta}>2020</p>
              <p>
                The starting point—hands-on web fundamentals that kickstarted my
                deeper dive into software engineering and ultimately the bachelor’s.
              </p>
              <p className={fxStyles.badgeRow}>
                <span className={fxStyles.badge}>HTML/CSS</span>
                <span className={fxStyles.badge}>JavaScript</span>
                <span className={fxStyles.badge}>Responsive UI</span>
              </p>
            </div>
          </div>
        </section>

        <section
          id="panel-work"
          role="tabpanel"
          aria-labelledby="tab-work"
          hidden={tab !== "work"}
          className={fxStyles.panel}
        >
          <div className={fxStyles.panelBody}>
            <div className={fxStyles.sectionBlock}>
              <h2>Anything Electronic</h2>
              <p className={fxStyles.cardMeta}>2018 – 2024</p>
              <p>
                Hired as the purchasing manager, I built supplier relationships and
                maintained inventory. I quickly took on more—surface-mount
                technology operation and key responsibilities on the manufacturing
                side. Also pitched in with web dev where needed.
              </p>
              <p className={fxStyles.badgeRow}>
                <span className={fxStyles.badge}>Inventory Management</span>
                <span className={fxStyles.badge}>Soldering &amp; Wiring</span>
                <span className={fxStyles.badge}>Web Development</span>
                <span className={fxStyles.badge}>Supplier Relations</span>
                <span className={fxStyles.badge}>SMT Operator</span>
              </p>
            </div>
          </div>
        </section>
      </BackgroundFX>
    </main>
  );
}
