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

        {/* ABOUT */}
        <section
          id="panel-about"
          role="tabpanel"
          aria-labelledby="tab-about"
          hidden={tab !== "about"}
          className={fxStyles.panel}
        >
          <div className={fxStyles.panelBody}>
            <p>
              Kia ora! I’m Ezekiel. I’m a recent grad from Victoria University of Wellington, where I got my Masters in Artificial Intelligence. I’m down in Nelson, and I’m basically tech-obsessed, from building out mobile apps to websites. When I need a break from the screen, I’m usually spending time with my wife and daughter or out playing sports. I’m also a huge fan of watching football, F1, and basketball. My latest obsession is hardware modding old Guitar Hero and Rock Band controllers, swapping parts, and giving them custom spray-painted faceplates.
            </p>
          </div>
        </section>

        {/* EDUCATION */}
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
              <h2 className={fxStyles.rgbGlitch}>Master of Artificial Intelligence</h2>
              <p className={fxStyles.cardMeta}>2024 – 2025</p>
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
                <span className={fxStyles.badge}>Regression</span>
                <span className={fxStyles.badge}>Classification</span>
              </p>
            </div>

            {/* Bachelor */}
            <div className={fxStyles.sectionBlock}>
              <h2 className={fxStyles.rgbGlitch}>Bachelor of Information Technology</h2>
              <p className={fxStyles.cardMeta}>2020 – 2023</p>
              <p>
                A 1 year diploma evolved into a three year bachelor’s at Nelson
                Marlborough Institute of Technology (NMIT). I developed core
                software, hardware, database, and web skills. I also explored CGI,
                creating worlds and stories in Unreal Engine. My final-year
                project involved predicting salmon health using AI where this was entirely self-guided as no course prepared me for this project. I ended up topping my class for this project.
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
              <h2 className={fxStyles.rgbGlitch}>Diploma of Web Development</h2>
              <p className={fxStyles.cardMeta}>2020</p>
              <p>
                This was the starting point for my information technology career as it allowed me to learn the fundamentals. However I believed that I still had a lot of learning before jumping into a career so I decided to extend my diploma into a degree.
              </p>
              <p className={fxStyles.badgeRow}>
                <span className={fxStyles.badge}>HTML/CSS</span>
                <span className={fxStyles.badge}>JavaScript</span>
                <span className={fxStyles.badge}>Responsive UI</span>
              </p>
            </div>
          </div>
        </section>

        {/* WORK (fixed spacing: single panelBody + sectionBlock per job) */}
        <section
          id="panel-work"
          role="tabpanel"
          aria-labelledby="tab-work"
          hidden={tab !== "work"}
          className={fxStyles.panel}
        >
          <div className={fxStyles.panelBody}>
            <div className={fxStyles.sectionBlock}>
              <h2 className={fxStyles.rgbGlitch}>Anything Electronic</h2>
              <p className={fxStyles.cardMeta}>2018 – 2024</p>
              <p>
                I started here as the Purchasing Manager, where I built relationship with the supplier and maintained inventory. My role quickly expanded to include hands-on work where I dealt with surface-mount technology operation and key responsibilities on the manufacturing side. After I left to pursue my diploma and degree, I later returned to the company as their Web Developer, successfully developing and customising their e-commerce platform using Zencart and PHP.
              </p>
              <p className={fxStyles.badgeRow}>
                <span className={fxStyles.badge}>Inventory Management</span>
                <span className={fxStyles.badge}>Soldering &amp; Wiring</span>
                <span className={fxStyles.badge}>Web Development</span>
                <span className={fxStyles.badge}>Supplier Relations</span>
                <span className={fxStyles.badge}>SMT Operator</span>
              </p>
            </div>

            <div className={fxStyles.sectionBlock}>
              <h2 className={fxStyles.rgbGlitch}>McDonalds</h2>
              <p className={fxStyles.cardMeta}>2013 – 2018</p>
              <p>
                My first real job out of school where it prepared myself for the real world. Starting as crew, I quickly moved up the ranks to shift manager. Over the years, I developed strong leadership skills and manageabilty which helped me later in other jobs. I built valuable relationships with regular customers which led me to exciting opportunities and gave me the confidence to network and seek out my next big professional challenge.
              </p>
              <p className={fxStyles.badgeRow}>
                <span className={fxStyles.badge}>Shift Manager</span>
                <span className={fxStyles.badge}>Leader</span>
                <span className={fxStyles.badge}>Scheduling</span>
                <span className={fxStyles.badge}>Customer Relations</span>
              </p>
            </div>
          </div>
        </section>
      </BackgroundFX>
    </main>
  );
}
