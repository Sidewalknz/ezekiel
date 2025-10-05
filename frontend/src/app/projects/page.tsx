"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import BackgroundFX from "../../components/BackgroundFX";
import pageStyles from "../page.module.css";
import fxStyles from "../../components/BackgroundFX.module.css";

/* ---- Types that match your CSV columns ---- */
type CategoryKey = "Personal" | "School" | "Professional";

type Project = {
  Name: string;
  Date: string;
  Category: CategoryKey | string;
  Description: string;
  Image: string;
  PercentCompleted: number;
  Skills: string[];
  Link: string;
  Features: string[];
  Tasks: string[];
};

/* ---- Tabs for filtering ---- */
type TabKey = "Personal" | "School" | "Professional";
const TABS: { key: TabKey; label: string }[] = [
  { key: "Personal", label: "Personal" },
  { key: "School", label: "School" },
  { key: "Professional", label: "Professional" },
];

/* ---- Tiny CSV parser (quoted fields supported) ---- */
function parseCSV(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = "";
  };

  const pushRow = () => {
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        pushField();
      } else if (ch === "\r") {
        // ignore
      } else if (ch === "\n") {
        pushField();
        pushRow();
      } else {
        field += ch;
      }
    }
  }
  if (field.length > 0 || row.length > 0) {
    pushField();
    pushRow();
  }

  if (rows.length === 0) return [];

  const header = rows[0].map((h) => h.trim());
  const out: Record<string, string>[] = [];

  for (let r = 1; r < rows.length; r++) {
    const data = rows[r];
    if (data.length === 1 && data[0].trim() === "") continue;
    const obj: Record<string, string> = {};
    header.forEach((key, idx) => {
      obj[key] = (data[idx] ?? "").trim();
    });
    out.push(obj);
  }
  return out;
}

/* ---- Convert raw CSV row to Project ---- */
function toProject(row: Record<string, string>): Project {
  const splitList = (val: string): string[] =>
    val ? val.split(";").map((s) => s.trim()).filter(Boolean) : [];

  const pctRaw = row["Percent Completed"] ?? row["PercentCompleted"] ?? "";
  const pct = Number(String(pctRaw).replace(/[^\d.]/g, "")) || 0;

  return {
    Name: row["Name"] ?? "",
    Date: row["Date"] ?? "",
    Category: (row["Category"] as CategoryKey) ?? "",
    Description: row["Description"] ?? "",
    Image: row["Image"] ?? "",
    PercentCompleted: pct,
    Skills: splitList(row["Skills"] ?? ""),
    Link: row["Link"] ?? "",
    Features: splitList(row["Features"] ?? ""),
    Tasks: splitList(row["Tasks"] ?? ""),
  };
}

export default function ProjectsPage() {
  const [tab, setTab] = useState<TabKey>("Personal");
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  // --- Measure header to position the scroll region below it (works on desktop & mobile)
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerH, setHeaderH] = useState<number>(0);
  useEffect(() => {
    const update = () => setHeaderH(headerRef.current ? headerRef.current.offsetHeight : 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Load CSV from /public/data/projects.csv
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/data/projects.csv", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const rows = parseCSV(text);
        const data = rows.map(toProject);
        if (alive) setProjects(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (alive) setError(msg);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Sort newest-ish first
  const sorted = useMemo(() => {
    const parseDate = (s: string): number => {
      const t = Date.parse(s);
      return Number.isNaN(t) ? 0 : t;
    };
    return [...projects].sort((a, b) => parseDate(b.Date) - parseDate(a.Date));
  }, [projects]);

  // Filter by selected tab/category
  const filtered = useMemo(
    () => sorted.filter((p) => p.Category.toLowerCase() === tab.toLowerCase()),
    [sorted, tab]
  );

  return (
    <main className={pageStyles.page}>
      <BackgroundFX
        className={pageStyles.fxWrapper}
        enableSnow
        enableVCR
        enableScanlines
        enableVignette
        enableWobbleY
        overlayCentered={false}
      >
        {/* Pinned site nav */}
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

        {/* Header (title + tabs) — same pattern as About */}
        <div ref={headerRef} className={fxStyles.aboutHeader}>
          <h1 className={`${fxStyles.centerText} ${fxStyles.rgbGlitch}`}>Projects</h1>

          <div className={fxStyles.tabBar} role="tablist" aria-label="Project categories">
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
        </div>

        {/* Absolute scroll region below measured header (desktop + mobile) */}
        <div className={fxStyles.contentScrollRegionMobile} style={{ top: headerH }}>
          <section
            id={`panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            className={fxStyles.panel}
          >
            <div className={fxStyles.panelBody}>
              {error && (
                <p style={{ color: "#f88", marginTop: "0.5rem" }}>
                  Failed to load projects: {error}
                </p>
              )}

              {!error && projects.length === 0 && (
                <p className={fxStyles.cardMeta}>Loading projects…</p>
              )}

              {!error && projects.length > 0 && filtered.length === 0 && (
                <p className={fxStyles.cardMeta}>No projects in “{tab}” yet.</p>
              )}

              {/* Scrollable list inside the panel body is no longer necessary,
                  since the whole region scrolls. Kept simple list markup. */}
              {filtered.map((p) => (
                <div
                  role="listitem"
                  key={`${p.Name}-${p.Date}`}
                  className={fxStyles.sectionBlock}
                  style={{
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <h2 className={fxStyles.rgbGlitch}>{p.Name}</h2>

                  <p className={fxStyles.cardMeta}>
                    {p.Date}
                    {p.Category ? ` · ${p.Category}` : ""}
                    {Number.isFinite(p.PercentCompleted)
                      ? ` · ${p.PercentCompleted}%`
                      : ""}
                  </p>

                  {p.Description && <p>{p.Description}</p>}

                  {p.Skills.length > 0 && (
                    <p className={fxStyles.badgeRow}>
                      {p.Skills.map((s) => (
                        <span key={s} className={fxStyles.badge}>
                          {s}
                        </span>
                      ))}
                    </p>
                  )}

                  {p.Features.length > 0 && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <p className={fxStyles.cardMeta}>Features</p>
                      <ul style={{ marginTop: "0.25rem", paddingLeft: "1.25rem" }}>
                        {p.Features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {p.Tasks.length > 0 && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <p className={fxStyles.cardMeta}>Tasks</p>
                      <ul style={{ marginTop: "0.25rem", paddingLeft: "1.25rem" }}>
                        {p.Tasks.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {p.Link && (
                    <p style={{ marginTop: "0.6rem" }}>
                      <a
                        href={p.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={fxStyles.rgbGlitchLink}
                        style={{ textTransform: "none", fontSize: "1rem" }}
                      >
                        View Project →
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </BackgroundFX>
    </main>
  );
}
