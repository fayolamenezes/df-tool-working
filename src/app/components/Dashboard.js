// src/components/Dashboard.js
"use client";
import Image from "next/image";

import {
  ShieldCheck,
  Network,
  Link2,
  Activity,
  Gauge,
  Zap,
  BarChart3,
  FileText,
  Goal,
  ChevronRight,
  HelpCircle,
  RefreshCw,
  Check,
  AlertTriangle,
  X,
  Clock3,
  ActivitySquare,
  Lock,
  Lightbulb,
  Skull,
  BookOpen,
  Eye,
  PencilLine,
  // Page Speed Scores icons
  Monitor,
  Smartphone,
  Rocket,
  TrendingUp,
  // New for Organic Keywords header
  KeyRound,
  SquareArrowOutUpRight,
  // New for Leads header
  Settings,
  SlidersHorizontal,
  Wifi,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { useEffect, useRef, useState, useMemo, useLayoutEffect } from "react";


import { useSearchParams } from "next/navigation";
export default function Dashboard() {
  // === Data loading (no UI changes) ===
  const [dataMap, setDataMap] = useState(null);   // JSON keyed by domain
  const [domain, setDomain] = useState("example.com");
  const [dataError, setDataError] = useState("");

  function normalizeDomain(input = "") {
    try {
      const url = input.includes("http") ? new URL(input) : new URL(`https://${input}`);
      let host = url.hostname.toLowerCase();
      if (host.startsWith("www.")) host = host.slice(4);
      return host;
    } catch {
      return input.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
    }
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/data/seo-data.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load seo-data.json");
        const json = await res.json();
        if (alive) setDataMap(json);
      } catch (e) {
        console.error(e);
        if (alive) setDataError("Couldn't load /data/seo-data.json (place it under public/data).");
      }
    })();
    return () => { alive = false; };
  }, []);

  
// Keep domain in sync with ?site= in the URL (reactive to client-side navigation)
const searchParams = useSearchParams();
useEffect(() => {
  const site = searchParams?.get("site");
  if (site) {
    setDomain(normalizeDomain(site));
  }
}, [searchParams]);
const selected = useMemo(() => {
    if (!dataMap) return null;
    const key = normalizeDomain(domain);
    return dataMap[key] || dataMap[`www.${key}`] || null;
  }, [dataMap, domain]);

  // ---- Domain Rating animation ----
  const DR_TARGET = (selected?.domainRating ?? 53.6);
  const DR_BAR = (selected?.trustBar ?? 72);
  const DURATION = 800;

  const [drValue, setDrValue] = useState(0);
  const [drWidth, setDrWidth] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      const ease = Math.max(0, Math.min(1, 1 - Math.pow(1 - t, 3)));
      setDrValue(DR_TARGET * ease);
      setDrWidth(DR_BAR * ease);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [DR_TARGET, DR_BAR]);

  // ---- Referring Domains animation ----
  const RD_TARGET = (selected?.referringDomains ?? 63400);
  const RD_SEG_HIGH = 45;
  const RD_SEG_MED = 35;
  const RD_SEG_LOW = 20;
  const RD_DURATION = 900;

  const [rdValue, setRdValue] = useState(0);
  const [rdP, setRdP] = useState(0);
  const rdRaf = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / RD_DURATION);
      const ease = 1 - Math.pow(1 - t, 3);
      setRdValue(RD_TARGET * ease);
      setRdP(ease);
      if (t < 1) rdRaf.current = requestAnimationFrame(step);
    };
    rdRaf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rdRaf.current);
  }, [RD_TARGET]);

  // ---- Total Backlinks animation ----
  const TB_TARGET = (((selected?.backlinks ?? (26.1 * 1_000_000_000))) / 1_000_000_000);
  const TB_DURATION = 800;
  const [tbValue, setTbValue] = useState(0);
  const tbRaf = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / TB_DURATION);
      const ease = 1 - Math.pow(1 - t, 3);
      setTbValue(TB_TARGET * ease);
      if (t < 1) tbRaf.current = requestAnimationFrame(step);
    };
    tbRaf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(tbRaf.current);
  }, [TB_TARGET]);

  // ---- Site Health Score animations ----
  const SH_SCORE = (selected?.siteHealth ?? 100.0);
  const SH_PAGES = 2100;
  const SH_REDIRECT = 89;
  const SH_BROKEN = 15;
  const SH_DURATION = 900;

  const [shValue, setShValue] = useState(0);
  const [pagesScanned, setPagesScanned] = useState(0);
  const [redirects, setRedirects] = useState(0);
  const [broken, setBroken] = useState(0);
  const shRaf = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / SH_DURATION);
      const ease = 1 - Math.pow(1 - t, 3);
      setShValue(SH_SCORE * ease);
      setPagesScanned(Math.round(SH_PAGES * ease));
      setRedirects(Math.round(SH_REDIRECT * ease));
      setBroken(Math.round(SH_BROKEN * ease));
      if (t < 1) shRaf.current = requestAnimationFrame(step);
    };
    shRaf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(shRaf.current);
  }, [SH_SCORE, SH_PAGES, SH_REDIRECT, SH_BROKEN]);

  // ---- Core Web Vitals animations ----
  const LCP_TARGET = (selected?.coreWebVitals?.LCP ?? 2.1); // seconds
  const INP_TARGET = (selected?.coreWebVitals?.INP ?? 180); // ms
  const CLS_TARGET = (selected?.coreWebVitals?.CLS ?? 0.08); // ms (per your label)
  const CWV_DURATION = 900;

  const [lcp, setLcp] = useState(0);
  const [inp, setInp] = useState(0);
  const [cls, setCls] = useState(0);
  const cwvRaf = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / CWV_DURATION);
      const ease = 1 - Math.pow(1 - t, 3);
      setLcp(LCP_TARGET * ease);
      setInp(INP_TARGET * ease);
      setCls(CLS_TARGET * ease);
      if (t < 1) cwvRaf.current = requestAnimationFrame(step);
    };
    cwvRaf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(cwvRaf.current);
  }, [LCP_TARGET, INP_TARGET, CLS_TARGET]);

  // ------------------------------------------------------------------
  // Page Speed Scores: shared progress so both rings animate on load
  // ------------------------------------------------------------------
  const PS_DURATION = 900;
  const [psProgress, setPsProgress] = useState(0); // 0→1
  const psRaf = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / PS_DURATION);
      const ease = 1 - Math.pow(1 - t, 3);
      setPsProgress(ease);
      if (t < 1) psRaf.current = requestAnimationFrame(step);
    };
    psRaf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(psRaf.current);
  }, []);

  // ---- Organic Traffic (Row 3) animations ----
  const OT_TARGET = (selected?.organicTraffic?.monthly ?? 38600); // 38.6k
  const OT_DURATION = 1100;

  const [otValue, setOtValue] = useState(0); // counter
  const [otProg, setOtProg] = useState(0);   // 0→1 reveal for graph
  const otRaf = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / OT_DURATION);
      const ease = 1 - Math.pow(1 - t, 3);
      setOtValue(OT_TARGET * ease);
      setOtProg(ease);
      if (t < 1) otRaf.current = requestAnimationFrame(step);
    };
    otRaf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(otRaf.current);
  }, [OT_TARGET]);

  // ---- Organic Keywords (Row 3) animations ----
  const OK_TOTAL = (selected?.organicKeywords?.total ?? 90600); // 90.6k
  const OK_DURATION = 1100;

  const [okValue, setOkValue] = useState(0); // animated total
  const [okProg, setOkProg] = useState(0); // 0→1 for bars
  const okRaf = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / OK_DURATION);
      const ease = 1 - Math.pow(1 - t, 3);
      setOkValue(OK_TOTAL * ease);
      setOkProg(ease);
      if (t < 1) okRaf.current = requestAnimationFrame(step);
    };
    okRaf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(okRaf.current);
  }, [OK_TOTAL]);

  // ---- Leads (Row 3) animations ----
  const LEADS_TARGET = (selected?.leads?.monthly ?? 887); // big animated number
  const LEADS_GOAL = 1500;  // for main progress
  const CF_VALUE = (selected?.leads?.cf ?? 642);
  const NL_VALUE = (selected?.leads?.newsletter ?? 245);
  // choose per-row "limits" to visually match screenshot lengths
  const CF_LIMIT = 800;
  const NL_LIMIT = 400;

  const LEADS_DURATION = 1100;
  const [leadsCount, setLeadsCount] = useState(0);
  const [leadsProg, setLeadsProg] = useState(0); // 0→1 for all three bars
  const leadsRaf = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / LEADS_DURATION);
      const ease = 1 - Math.pow(1 - t, 3);
      setLeadsCount(LEADS_TARGET * ease);
      setLeadsProg(ease);
      if (t < 1) leadsRaf.current = requestAnimationFrame(step);
    };
    leadsRaf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(leadsRaf.current);
  }, [LEADS_TARGET]);

  // ---- Row 4 (SERP features) animated counts ----
  const SERP_TARGETS = useMemo(() => [23, 156, 89, 34, 12], []); // Featured, PAA, Image Pack, Video, Knowledge
  const [serpCounts, setSerpCounts] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    const DURATION = 900;
    const start = performance.now();
    let rafId;
    const step = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      const ease = 1 - Math.pow(1 - t, 3);
      setSerpCounts(SERP_TARGETS.map((n) => Math.round(n * ease)));
      if (t < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [SERP_TARGETS]);

    // ---- Row 4 (SERP coverage %) animation ----
    const SERP_COVERAGE = 45;
    const [serpCoverage, setSerpCoverage] = useState(0);
    useEffect(() => {
      const DURATION = 900;
      const start = performance.now();
      let raf;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / DURATION);
        const ease = 1 - Math.pow(1 - t, 3);
        setSerpCoverage(SERP_COVERAGE * ease);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, []);

    // ---- Row 4 (AI SEO Matrix numerator) animation ----
    const MATRIX_NUM_TARGET = 2;
    const [matrixNum, setMatrixNum] = useState(0);
    useEffect(() => {
      const DURATION = 700;
      const start = performance.now();
      let raf;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / DURATION);
        const ease = 1 - Math.pow(1 - t, 3);
        setMatrixNum(Math.round(MATRIX_NUM_TARGET * ease));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, []);

    // ---- On-Page SEO Opportunities (Row) counters ----
    const [oppCounts, setOppCounts] = useState([0, 0, 0, 0]);

    useEffect(() => {
      const TARGETS = [274, 883, 77, 5];
      const DURATION = 900;
      const start = performance.now();
      let raf;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / DURATION);
        const ease = 1 - Math.pow(1 - t, 3);
        setOppCounts(TARGETS.map((n) => Math.max(0, Math.round(n * ease))));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, []);

    // ---- Shared progress for the "Top On-Page Content Opportunities" section
    const [oppCardsProgress, setOppCardsProgress] = useState(0);
    useLayoutEffect(() => {
      const DURATION = 800; // match your taste
      const start = performance.now();
      let raf;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / DURATION);
        const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
        setOppCardsProgress(ease);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, []);

    // ---- "New on page SEO opportunity" table: shared progress 0→1 ----
    const SEO_TABLE_DURATION = 900;
    const [seoTableProg, setSeoTableProg] = useState(0);
    useLayoutEffect(() => {
      const start = performance.now();
      let raf;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / SEO_TABLE_DURATION);
        const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
        setSeoTableProg(ease);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, []);

    // color-coded animated difficulty bar
    function DifficultyBar({ value, progress = 1 }) {
      const [mounted, setMounted] = useState(false);
      useEffect(() => { setMounted(true); }, []);

      const pct = Math.max(0, Math.min(100, value));
      const p   = Math.max(0, Math.min(1, progress));
      const fill = pct < 40 ? "#EF4444" : pct < 70 ? "#F59E0B" : "#10B981";

      return (
        <div className="relative h-2 w-24 overflow-hidden rounded-full bg-[#E5E7EB]">
          <div
            className="h-2 rounded-full w-0"
            style={{
              width: `${pct * p}%`,
              backgroundColor: fill,
              transition: mounted ? "width 140ms linear" : "none",
            }}
          />
        </div>
      );
    }

    // table data (same rows as the screenshot)
    const seoRows = [
      { keyword: "How to fix slow Wi-Fi", type: "Informational", volume: 7032, difficulty: 98 },
      { keyword: "How to fix slow Wi-Fi", type: "Informational", volume: 7032, difficulty: 88 },
      { keyword: "How to fix slow Wi-Fi", type: "Transactional", volume: 7032, difficulty: 98 },
      { keyword: "How to fix slow Wi-Fi", type: "Informational", volume: 7032, difficulty: 28 },
      { keyword: "How to fix slow Wi-Fi", type: "Transactional", volume: 7032, difficulty: 28 },
      { keyword: "How to fix slow Wi-Fi", type: "Transactional", volume: 7032, difficulty: 68 },
      { keyword: "How to fix slow Wi-Fi", type: "Informational", volume: 7032, difficulty: 48 },
    ];

    // simple count-up hook
    function useCountUp(target, duration = 900) {
      const [v, setV] = useState(0);
      useEffect(() => {
        let raf; const start = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const ease = 1 - Math.pow(1 - t, 3);
          setV(target * ease);
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
      }, [target, duration]);
      return v;
    }

    // threshold → colors/labels (matches the image look)
    function getPriority(score) {
      if (score <= 30) {
        return {
          label: "High Priority",
          dot: "#EF4444",
          pillBg: "#FFF0F4",
          pillBorder: "#FFE1EA",
          pillText: "#D12C2C",
          chipBg: "#FFF0F4",
          chipBorder: "#FFE1EA",
          chipText: "#D12C2C",
        };
      }
      if (score <= 70) {
        return {
          label: "Medium Priority",
          dot: "#F59E0B",
          pillBg: "#FFF5D9",
          pillBorder: "#FDE7B8",
          pillText: "#B98500",
          chipBg: "#FFF5D9",
          chipBorder: "#FDE7B8",
          chipText: "#B98500",
        };
      }
      return {
        label: "Low Priority",
        dot: "#22C55E",
        pillBg: "#EAF8F1",
        pillBorder: "#CBEBD9",
        pillText: "#178A5D",
        chipBg: "#EAF8F1",
        chipBorder: "#CBEBD9",
        chipText: "#178A5D",
      };
    }

    function OpportunityCard({
      title,
      score,
      wordCount,
      keywords,
      status,          // "Published" | "Draft"
      progress = 1,    // <-- pass oppCardsProgress here
    }) {
      const scoreAnim = Math.max(0, Math.round(score * progress));
      const wordAnim  = Math.max(0, Math.round(wordCount * progress));
      const keyAnim   = Math.max(0, Math.round(keywords * progress));
      const pri = getPriority(score);

      return (
        <div className="relative rounded-[18px] border border-[#E7EAF0] bg-[var(--input)] p-4 shadow-sm">
          {/* score chip + black tooltip on hover */}
          <div className="group absolute right-4 top-4">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-semibold shadow-sm tabular-nums"
              style={{ backgroundColor: pri.chipBg, border: `1px solid ${pri.chipBorder}`, color: pri.chipText }}
              aria-label={`Page Speed Indicator: ${scoreAnim}`}
            >
              {scoreAnim}
            </div>
            <div className="pointer-events-none absolute -top-3 right-1/2 z-10 w-max translate-x-1/2 -translate-y-full
                            rounded-md bg-black px-3 py-2 text-white opacity-0 shadow-lg transition-opacity
                            duration-150 group-hover:opacity-100">
              <div className="text-[12px] font-semibold">Page Speed Indicator: {scoreAnim}</div>
              <div className="mt-0.5 text-[11px] text-gray-300">Your site&#39;s credit rating with Google.</div>
              <span className="absolute left-1/2 top-full -translate-x-1/2
                              border-x-8 border-t-8 border-b-0 border-solid
                              border-x-transparent border-t-black" />
            </div>
          </div>

          <div className="pr-14">
            <h3 className="text-[20px] font-semibold leading-snug text-[#0F172A]">{title}</h3>
          </div>

          <hr className="mt-3 border-t border-[#ECEFF5]" />

          <div className="mt-3 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-2 rounded-[10px] px-2.5 py-1 text-[12px] font-medium"
              style={{ backgroundColor: pri.pillBg, border: `1px solid ${pri.pillBorder}`, color: pri.pillText }}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pri.dot }} />
              {pri.label}
            </span>
            <span className="inline-flex items-center gap-2 rounded-[10px] border border-[#E7EAF0] bg-[#F6F8FB] px-2.5 py-1 text-[12px] text-[#6B7280]">
              {status === "Published" ? <Check size={14} /> : <PencilLine size={14} />}
              {status}
            </span>
          </div>

          <div className="mt-4 rounded-[12px] border border-[#E7EAF0] bg-[var(--input)] px-4 py-3">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-[12px] text-[#6B7280]">Word Count</div>
                <div className="mt-1 text-[28px] font-semibold leading-none text-[#0F172A] tabular-nums">
                  {wordAnim.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[#6B7280]">Keywords</div>
                <div className="mt-1 text-[28px] font-semibold leading-none text-[#0F172A] tabular-nums">
                  {keyAnim}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button className="inline-flex items-center gap-2 rounded-[10px] border border-[#E7EAF0] bg-[#FAFBFD] px-3 py-2 text-[12px] font-medium text-[#566072]">
              <Eye size={14} /> View Details
            </button>
            <button className="inline-flex items-center gap-2 rounded-[14px] px-4 py-2 text-[13px] font-semibold text-white shadow-sm bg-[image:var(--infoHighlight-gradient)]">
              Start <ChevronRight size={16} />
            </button>
          </div>
        </div>
      );
    }

  // helper for ring (kept for other areas)
  const ring = (value, color) => {
    const pct = Math.max(0, Math.min(100, value));
    const angle = (pct / 100) * 360;
    const bg = `conic-gradient(${color} ${angle}deg, #E5E7EB 0deg)`;
    return (
      <div className="flex flex-col items-center">
        <div className="relative h-24 w-24 rounded-full" style={{ background: bg }}>
          <div className="absolute inset-2 rounded-full bg-[var(--input)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[22px] font-semibold leading-none">{pct}</div>
          </div>
        </div>
      </div>
    );
  };

  function CircleGauge({ target, color, label, Icon, progress }) {
    const pct = Math.max(0, Math.min(100, target * progress));
    const angle = (pct / 100) * 360;
    const bg = `conic-gradient(${color} ${angle}deg, #E5E7EB 0deg)`;
    return (
      <div className="flex flex-col items-center ">
        <div className="relative h-32 w-32 rounded-full" style={{ background: bg }}>
          <div className="absolute inset-3 rounded-full bg-[var(--input)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <div className="text-[28px] font-semibold leading-none text-[#374151] tabular-nums">
              {Math.round(pct)}
            </div>
            <div className="flex items-center gap-1 text-[12px] text-[#6B7280]">
              {Icon ? <Icon size={14} /> : null}
              {label}
            </div>
          </div>
        </div>
        <span className="mt-3 inline-flex items-center gap-1 rounded-full border border-[#BEE7D6] bg-[#EAF8F1] px-2.5 py-1 text-[12px] font-medium text-[#178A5D]">
          Excellent
          <TrendingUp size={14} />
        </span>
      </div>
    );
  }

  const PS_DESKTOP = (selected?.pageSpeed?.desktop ?? 95);
  const PS_MOBILE = (selected?.pageSpeed?.mobile ?? 87);

  return (
    <main className="min-h-screen bg-[var(--bg-panel)] px-4 py-6 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="mx-auto max-w-[100%] mt-1">
        {/* Row 1 */}
        <h2 className="text-[16px] font-bold text-gray-900 mb-3 ml-1">
          Off-Page SEO Metrics
        </h2>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Domain Rating */}
          <div className="rounded-[14px] border border-[#E7EAF0] bg-[var(--input)] p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#ECF0F4] bg-[#F7F9FC] text-[#6B7280]">
                  <ShieldCheck size={16} />
                </span>
                <span className="text-[13px] text-gray-700 leading-relaxed">
                  Domain Rating
                </span>
              </div>
              <span className="rounded-full bg-[#EAF8F1] px-2 py-0.5 text-[11px] font-medium text-[#178A5D]">
                Above Average
              </span>
            </div>

            <div className="mt-3 flex items-end gap-2">
              <div className="text-[32px] font-semibold leading-none text-[#151824] tabular-nums">
                {drValue.toFixed(1)}
              </div>
              <div className="pb-1 text-[13px] text-[#8D96A8]">/ 100</div>
              <div className="ml-auto text-[12px] font-medium text-[#1BA97A]">
                ↗︎ +8.4%
              </div>
            </div>

            <div className="mt-3 text-[11px] text-[#8D96A8]">
              Industry Avg: <span className="font-medium text-[#566072]">45.2</span>
            </div>

            <div className="mt-3 text-[12px] text-[#566072]">Trust score</div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#EEF2F7]">
              <div
                className="h-2 rounded-full bg-[#1CC88A] transition-[width] duration-100 ease-linear"
                style={{ width: `${drWidth}%` }}
              />
            </div>
          </div>

          {/* Referring Domains */}
          <div className="rounded-[14px] border border-[#E7EAF0] bg-[var(--input)] p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#ECF0F4] bg-[#F7F9FC] text-[#6B7280]">
                  <Network size={16} />
                </span>
                <span className="text-[13px] text-gray-700 leading-relaxed">
                  Referring Domains
                </span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF6E7] px-2 py-0.5 text-[11px] font-medium text-[#B67200]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#F59E0B]" />
                Growing
              </span>
            </div>

            <div className="mt-3 flex items-end gap-2">
              <div className="text-[32px] font-semibold leading-none text-[#151824] tabular-nums">
                {rdValue >= 1000 ? (rdValue / 1000).toFixed(1) + "k" : Math.round(rdValue)}
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1 rounded-[10px] border border-[#EDF1F5] bg-[#FAFBFD] px-3 py-2 text-[12px] text-[#566072]">
                Quality Distribution
              </div>

              <div className="relative">
                <div className="h-2 w-full rounded-full bg-[#EEF2F7]" />
                <div className="absolute inset-0 flex h-2 items-stretch gap-[6px] px-[2px]">
                  <div
                    className="h-2 self-center rounded-full bg-[#1CC88A]"
                    style={{ width: `${RD_SEG_HIGH * rdP}%` }}
                  />
                  <div
                    className="h-2 self-center rounded-full bg-[#F59E0B]"
                    style={{ width: `${RD_SEG_MED * rdP}%` }}
                  />
                  <div
                    className="h-2 self-center rounded-full bg-[#EF4444]"
                    style={{ width: `${RD_SEG_LOW * rdP}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-6 text-[11px] text-[#8D96A8]">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#1CC88A]" /> High: 45%
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#F59E0B]" /> Medium: 35%
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#EF4444]" /> Low: 20%
                </span>
              </div>
            </div>
          </div>

          {/* Total Backlinks */}
          <div className="rounded-[14px] border border-[#E7EAF0] bg-[var(--input)] p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#ECF0F4] bg-[#F7F9FC] text-[#6B7280]">
                  <Link2 size={16} />
                </span>
                <span className="text-[13px] text-gray-700 leading-relaxed">
                  Total Backlinks
                </span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF0FF] px-2 py-0.5 text-[11px] font-medium text-[#4C53D8]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#3B82F6]" />
                Strong Profile
              </span>
            </div>

            <div className="mt-3 flex items-end gap-2">
              <div className="text-[32px] font-semibold leading-none text-[#151824] tabular-nums">
                {tbValue.toFixed(1)}B
              </div>
              <div className="ml-auto text-[12px] font-medium text-[#1BA97A]">↗︎ +8.4%</div>
            </div>

            <div className="mt-3 grid gap-3 text-[12px]">
              <div className="relative grid h-16 grid-cols-[1fr_auto] items-center rounded-[10px] border border-[#E7EAF0] bg-[#FAFBFD] px-3">
                <span className="absolute left-0 top-0 h-full w-[4px] rounded-l-[10px] bg-[#1CC88A]" />
                <div className="flex flex-col">
                  <div className="text-[#566072]">DoFollow</div>
                  <div className="mt-0.5 text-[20px] font-semibold text-[#151824]">78%</div>
                </div>
                <div className="text-right text-[11px] text-[#8D96A8]">
                  Link that give <span className="font-medium text-[#2B3040]">SEO</span> credit
                </div>
              </div>

              <div className="relative grid h-16 grid-cols-[1fr_auto] items-center rounded-[10px] border border-[#E7EAF0] bg-[#FAFBFD] px-3">
                <span className="absolute left-0 top-0 h-full w-[4px] rounded-l-[10px] bg-[#EF4444]" />
                <div className="flex flex-col">
                  <div className="text-[#566072]">NoFollow</div>
                  <div className="mt-0.5 text-[20px] font-semibold text-[#151824]">22%</div>
                </div>
                <div className="text-right text-[11px] text-[#8D96A8]">
                  Link that just mention, no <span className="font-medium text-[#2B3040]">SEO</span> value
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Row 2 */}
        <h2 className="text-[16px] font-bold text-gray-900 mb-3 ml-1">
          Technical SEO
        </h2>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Site Health (animated) */}
          <div className="rounded-[14px] border border-[#E7EAF0] bg-[var(--input)] p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#E3F3EA] bg-[#F3FBF7] text-[#178A5D]">
                  <Activity size={16} />
                </span>
                <span className="flex items-center gap-1 text-[13px] text-gray-700 leading-relaxed">
                  Site Health Score
                  <HelpCircle className="text-[#9AA3B2]" size={14} />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF4FF] px-2 py-0.5 text-[11px] font-medium text-[#3178C6]">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#3B82F6]" />
                  Excellent
                </span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#E7EAF0] text-[#6B7280]">
                  <RefreshCw size={14} />
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-end gap-2">
              <div className="text-[32px] font-semibold leading-none text-[#151824] tabular-nums">
                {shValue.toFixed(1)}
              </div>
              <div className="pb-1 text-[13px] text-[#8D96A8]">/ 100</div>
            </div>

            <ul className="mt-3 space-y-2 text-[13px]">
              <li className="flex items-center justify-between rounded-[10px] border border-[#DFF1E7] bg-[#F3FBF7] px-3 py-3">
                <span className="flex items-center gap-2 text-[#178A5D]">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-[#DFF1E7] bg-[var(--input)]">
                    <Check size={14} />
                  </span>
                  Page Scanned
                </span>
                <span className="font-semibold text-[#2B3040] tabular-nums">{pagesScanned}</span>
              </li>

              <li className="flex items-center justify-between rounded-[10px] border border-[#FDEFCF] bg-[#FFF9EC] px-3 py-3">
                <span className="flex items-center gap-2 text-[#B67200]">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-[#FDEFCF] bg-[var(--input)]">
                    <AlertTriangle size={14} />
                  </span>
                  Redirect
                </span>
                <span className="font-semibold text-[#2B3040] tabular-nums">{redirects}</span>
              </li>

              <li className="flex items-center justify-between rounded-[10px] border border-[#FFE3E3] bg-[#FFF6F6] px-3 py-3">
                <span className="flex items-center gap-2 text-[#D12C2C]">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-[#FFE3E3] bg-[var(--input)]">
                    <X size={14} />
                  </span>
                  Broken
                </span>
                <span className="font-semibold text-[#2B3040] tabular-nums">{broken}</span>
              </li>
            </ul>
          </div>

          {/* Core Web Vitals (UPDATED & animated) */}
          <div className="rounded-[14px] border border-[#E7EAF0] bg-[var(--input)] p-4 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#FFE1EA] bg-[#FFF0F4] text-[#D12C2C]">
                  <Gauge size={16} />
                </span>
                <span className="flex items-center gap-1 text-[13px] text-gray-700 leading-relaxed">
                  Core web vitals
                  <HelpCircle className="text-[#9AA3B2]" size={14} />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF8F1] px-2 py-0.5 text-[11px] font-medium text-[#178A5D]">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#22C55E]" />
                  All Good
                </span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#E7EAF0] text-[#6B7280]">
                  <RefreshCw size={14} />
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* LCP */}
              <div className="rounded-[12px] border border-[#EDF1F5] bg-[#FAFBFD] p-4 text-center">
                <div className="mb-2 flex items-center justify-center gap-2 text-[12px] text-[#6B7280]">
                  <Clock3 size={14} />
                  <span className="font-medium text-[#2B3040]">LCP</span>
                  <span className="ml-1 rounded-full bg-[#EAF8F1] px-2 py-0.5 text-[10px] font-medium text-[#178A5D]">
                    Good
                  </span>
                </div>
                <div className="text-[22px] font-semibold leading-none text-[#151824] tabular-nums">
                  {lcp.toFixed(1)}s
                </div>
                <div className="mt-1 text-[11px] text-[#8D96A8]">&lt; 2.5s</div>
              </div>

              {/* INP */}
              <div className="rounded-[12px] border border-[#EDF1F5] bg-[#FAFBFD] p-4 text-center">
                <div className="mb-2 flex items-center justify-center gap-2 text-[12px] text-[#6B7280]">
                  <ActivitySquare size={14} />
                  <span className="font-medium text-[#2B3040]">INP</span>
                  <span className="ml-1 rounded-full bg-[#EAF8F1] px-2 py-0.5 text-[10px] font-medium text-[#178A5D]">
                    Good
                  </span>
                </div>
                <div className="text-[22px] font-semibold leading-none text-[#151824] tabular-nums">
                  {Math.round(inp)}ms
                </div>
                <div className="mt-1 text-[11px] text-[#8D96A8]">&lt; 200ms</div>
              </div>

              {/* CLS */}
              <div className="rounded-[12px] border border-[#EDF1F5] bg-[#FAFBFD] p-4 text-center">
                <div className="mb-2 flex items-center justify-center gap-2 text-[12px] text-[#6B7280]">
                  <Lock size={14} />
                  <span className="font-medium text-[#2B3040]">CLS</span>
                  <span className="ml-1 rounded-full bg-[#EAF8F1] px-2 py-0.5 text-[10px] font-medium text-[#178A5D]">
                    Good
                  </span>
                </div>
                <div className="text-[22px] font-semibold leading-none text-[#151824] tabular-nums">
                  {cls.toFixed(2)}ms
                </div>
                <div className="mt-1 text-[11px] text-[#8D96A8]">&lt; 0.1ms</div>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-[#8D96A8]">
              <span className="text-[#C5CBD6]">•</span> Data from{" "}
              <span className="font-semibold text-[#2B3040]">Page Speed Insights</span>
            </div>
          </div>

          {/* Page Speed Scores (animated with shared progress) */}
          <div className="rounded-[14px] border border-[#E7EAF0] bg-[var(--input)] p-4 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#E3F3EA] bg-[#F3FBF7] text-[#178A5D]">
                  <Rocket size={16} />
                </span>
                <span className="flex items-center gap-1 text-[13px] text-gray-700 leading-relaxed">
                  Page Speed Scores
                  <HelpCircle className="text-[#9AA3B2]" size={14} />
                </span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF4FF] px-2 py-0.5 text-[11px] font-medium text-[#3178C6]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#3B82F6]" />
                Fast
              </span>
            </div>

            {/* Gauges */}
            <div className="mt-5 grid grid-cols-2 place-items-center gap-6">
              <CircleGauge target={PS_DESKTOP} color="#3B82F6" label="Desktop" Icon={Monitor} progress={psProgress} />
              <CircleGauge target={PS_MOBILE} color="#8B5CF6" label="Mobile" Icon={Smartphone} progress={psProgress} />
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-center gap-1 text-[11px] text-[#8D96A8]">
              <span className="text-[#C5CBD6]">•</span> Data from{" "}
              <span className="font-semibold text-[#2B3040]">Page Speed Insights</span>
            </div>
          </div>
        </section>

        {/* Row 3 */}
        <h2 className="text-[16px] font-bold text-gray-900 mb-3 ml-1">
          Performance (SEO Metrics)
        </h2>

        <section className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Organic Traffic (animated counter + animated area/line) */}
          <div className="rounded-[14px] border border-[#E7EAF0] bg-[var(--input)] p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#ECF0F4] bg-[#F7F9FC] text-[#6B7280]">
                  <BarChart3 size={16} />
                </span>
                <span className="flex items-center gap-1 text-[13px] text-gray-700 leading-relaxed">Organic traffic</span>

                {/* Positive Growth with green dot */}
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#EAF8F1] px-2 py-0.5 text-[11px] font-medium text-[#178A5D]">
                  <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                  Positive Growth
                </span>
              </div>

              {/* All Devices with down chevron */}
              <div className="inline-flex items-center gap-1 text-[11px] text-[#8D96A8]">
                All Devices
                <ChevronRight size={14} className="-rotate-90" />
              </div>
            </div>

            <div className="mt-3 flex items-end gap-2">
              <div className="text-[32px] font-semibold leading-none text-[#151824] tabular-nums">
                {otValue >= 1000 ? (otValue / 1000).toFixed(1) + "k" : Math.round(otValue)}
              </div>
              <div className="ml-1 inline-flex items-center gap-1 rounded-full bg-[#EAF8F1] px-2 py-0.5 text=[11px] font-medium text-[#178A5D]">
                ↗︎ +23
              </div>
            </div>

            {/* Animated graph */}
            <div className="mt-4 h-28 w-full rounded-[10px]">
              <svg viewBox="0 0 520 140" className="h-full w-full">
                <defs>
                  <linearGradient id="ot-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                  </linearGradient>
                  <mask id="ot-reveal" maskUnits="objectBoundingBox">
                    <rect x="0" y="0" width={`${otProg * 100}%`} height="100%" fill="#fff" />
                  </mask>
                </defs>

                {/* reveal group */}
                <g mask="url(#ot-reveal)">
                  {/* Area */}
                  <path
                    d="M 8 120
                       C 60 60, 110 85, 150 95
                       S 240 110, 270 88
                       S 350 60, 385 92
                       S 455 60, 512 20
                       L 512 140 L 8 140 Z"
                    fill="url(#ot-fill)"
                  />
                  {/* Line */}
                  <path
                    d="M 8 120
                       C 60 60, 110 85, 150 95
                       S 240 110, 270 88
                       S 350 60, 385 92
                       S 455 60, 512 20"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    pathLength="100"
                    strokeDasharray="100"
                    strokeDashoffset={100 - otProg * 100}
                  />
                </g>

                {/* Right-side tiny scale labels */}
                <g fontFamily="ui-sans-serif, system-ui" fontSize="10" fill="#8D96A8" textAnchor="start">
                  <text x="500" y="18">+23</text>
                  <text x="500" y="54">18</text>
                  <text x="500" y="90">12</text>
                </g>

                {/* Marker with label 18 */}
                <g>
                  <circle cx="300" cy="84" r="3" fill="#22C55E" opacity="0.9" />
                  <line x1="300" y1="84" x2="300" y2="64" stroke="#22C55E" strokeDasharray="3 3" />
                  <g transform="translate(292,58)">
                    <rect rx="6" width="20" height="18" fill="white" stroke="#E7EAF0" />
                    <text x="10" y="12" fontSize="10" fill="#2B3040" textAnchor="middle">18</text>
                  </g>
                </g>
              </svg>
            </div>

            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1 rounded-[10px] border border-[#E7EAF0] bg-[#FAFBFD] px-3 py-2 text-[12px] font-medium text-[#566072]"
            >
              Connect to Google Analytics <ChevronRight size={14} />
            </button>
          </div>

          {/* Organic Keywords (animated & restructured) */}
          <div className="rounded-[14px] border border-[#E7EAF0] bg-[var(--input)] p-4 shadow-sm">
            {/* Header with icons like the reference */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#FDE7B8] bg-[#FFF5D9] text-[#B98500]">
                  <KeyRound size={16} />
                </span>
                <span className="flex items-center gap-1 text-[13px] text-gray-700 leading-relaxed">
                  Organic Keywords
                </span>
                <HelpCircle size={14} className="text-[#9AA3B2]" />
              </div>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E7EAF0] text-[#6B7280]">
                <SquareArrowOutUpRight size={16} />
              </span>
            </div>

            {/* Big total animated */}
            <div className="mt-3 text-[32px] font-semibold leading-none text-[#151824] tabular-nums">
              {okValue >= 1000 ? (okValue / 1000).toFixed(1) + "k" : Math.round(okValue)}
            </div>

            {/* Three rows: label → number → progress bar; bars animate */}
            <div className="mt-4 space-y-2">
              {[
                { label: "Top-3", v: 12300, t: 90600, c: "#638CF1" },
                { label: "Top-10", v: 24800, t: 90600, c: "#F4B740" },
                { label: "Top-100", v: 53600, t: 90600, c: "#22C55E" },
              ].map((row) => {
                const pct = Math.round((row.v / row.t) * 100);
                return (
                  <div
                    key={row.label}
                    className="grid grid-cols-[88px_auto_1fr] items-center  gap-3 rounded-[10px] border border-[#ECF0F4] bg-[#FAFBFD] px-3 py-2 rounded-tr-2xl"
                  >
                    <span className="inline-flex items-center justify-center rounded-md bg-[var(--input)] px-2 py-1 text-[12px] text-[#566072]">
                      {row.label}
                    </span>
                    <span className="text-[12px] font-semibold text-[#2B3040] tabular-nums">
                      {(row.v / 1000).toFixed(1)}k
                    </span>
                    <div className="h-2 w-full rounded-full bg-[#EEF2F7]">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${pct * okProg}%`,
                          backgroundColor: row.c,
                          transition: "width 120ms linear",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA bottom-right */}
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-[10px] border border-[#DDE3ED] bg-[#FAFBFD] px-3 py-2 text-[12px] font-medium text-[#566072]"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-[#E7EAF0] bg-[var(--input)]">
                  <FileText size={12} className="text-[#3178C6]" />
                </span>
                Connect to <span className="font-semibold text-[#2B3040]">Google Search Console</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Leads (animated, 3 bars, icons & layout) */}
          <div className="rounded-[14px] border border-[#E7EAF0] bg-[var(--input)] p-4 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#FFD8C7] bg-[#FFEFE8] text-[#D14B1F]">
                  <Goal size={16} />
                </span>
                <span className="flex items-center gap-1 text-[13px] text-gray-700 leading-relaxed">
                  Leads
                  <HelpCircle size={14} className="text-[#9AA3B2]" />
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#CBEBD9] bg-[#EAF8F1] px-2 py-0.5 text-[11px] font-medium text-[#178A5D]">
                  <TrendingUp size={14} />
                  + 8.4 %
                  <TrendingUp size={14} />
                </span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#E7EAF0] text-[#6B7280]">
                  <Settings size={14} />
                </span>
              </div>
            </div>

            {/* Big number */}
            <div className="mt-3 text-[32px] font-semibold leading-none text-[#151824] tabular-nums">
              {Math.round(leadsCount)}
            </div>

            {/* Goals row & main progress */}
            <div className="mt-2 flex items-center justify-between text-[12px]">
              <span className="text-[#566072]">
                Goals <span className="font-medium text-[#2B3040] tabular-nums">{Math.round(leadsCount)} / {LEADS_GOAL.toLocaleString()}</span>
              </span>
              <span className="text-[#8D96A8]">13% Remaining</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-[#E9EEF6]">
              <div
                className="h-2 rounded-full bg-[#22C55E]"
                style={{
                  width: `${(LEADS_TARGET / LEADS_GOAL) * 100 * leadsProg}%`,
                  transition: "width 120ms linear",
                }}
              />
            </div>

            {/* Breakdown rows */}
            <ul className="mt-4 space-y-3 text-[13px]">
              {/* Contact form */}
              <li className="grid grid-cols-[1fr_auto_160px] items-center gap-3">
                <span className="flex items-center gap-2 text-[#4B5563]">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#FAD7A5] bg-[#FFF6E7]">
                    <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                  </span>
                  Contact form
                </span>
                <span className="font-semibold text-[#2B3040] tabular-nums">{CF_VALUE}</span>
                <div className="h-2 w-full rounded-full bg-[#E9EEF6]">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(CF_VALUE / CF_LIMIT) * 100 * leadsProg}%`,
                      backgroundColor: "#F59E0B",
                      transition: "width 120ms linear",
                    }}
                  />
                </div>
              </li>

              {/* Newsletter */}
              <li className="grid grid-cols-[1fr_auto_160px] items-center gap-3">
                <span className="flex items-center gap-2 text-[#4B5563]">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#CFE1FF] bg-[#EFF5FF]">
                    <span className="h-2 w-2 rounded-full bg-[#3B82F6]" />
                  </span>
                  Newsletter
                </span>
                <span className="font-semibold text-[#2B3040] tabular-nums">{NL_VALUE}</span>
                <div className="h-2 w-full rounded-full bg-[#E9EEF6]">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(NL_VALUE / NL_LIMIT) * 100 * leadsProg}%`,
                      backgroundColor: "#3B82F6",
                      transition: "width 120ms linear",
                    }}
                  />
                </div>
              </li>
            </ul>

            {/* Footer link */}
            <div className="mt-3 text-right text-[12px] text-[#8D96A8]">
              <button type="button" className="inline-flex items-center gap-1">
                Change Goals <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* Row 4 */}
        <h2 className="text-[16px] font-bold text-gray-900 mb-3 ml-1">
          Advance SEO metrics
        </h2>

        <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Left: SERP feature */}
          <div className="rounded-[14px] border border-[#E7EAF0] bg-[var(--input)] p-4 shadow-sm">
            {/* header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#FDE7B8] bg-[#FFF5D9] text-[#B98500]">
                  {/* star badge, matches the screenshot */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3l2.2 5.1 5.6.5-4.2 3.7 1.3 5.5L12 14.9 7.1 17.8l1.3-5.5-4.2-3.7 5.6-.5L12 3z" fill="#F4B740"/>
                  </svg>
                </span>
                <span className="text-[13px] text-gray-700 leading-relaxed">
                  SERP feature
                </span>
                {/* use the same question-mark icon as other cards */}
                <HelpCircle size={14} className="text-[#9AA3B2]" />
              </div>
              {/* use the same filter/settings icon as other cards */}
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E7EAF0] text-[#6B7280]">
                <SlidersHorizontal size={16} />
              </span>
            </div>

            {/* coverage */}
            <div className="mt-4 flex items-baseline gap-3">
              <div className="text-[40px] font-bold leading-none tracking-tight text-[#0F172A] tabular-nums">
                {Math.round(serpCoverage)}
                <span className="align-top text-[28px]">%</span>
              </div>
              <div className="text-[14px] text-[#6B7280]">coverage</div>
            </div>

            {/* list (5 items, animated numbers) */}
            <div className="mt-4 space-y-2">
              {/* Featured Snippet */}
              <div className="flex items-center justify-between rounded-[12px] border border-[#F1F4F9] bg-[#FBFCFE] px-3 py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#FFF5D9] border border-[#FDE7B8]">
                    <svg width="12" height="12" viewBox="0 0 24 24"><path d="M12 3l2.2 5.1 5.6.5-4.2 3.7 1.3 5.5L12 14.9 7.1 17.8l1.3-5.5-4.2-3.7 5.6-.5L12 3z" fill="#F4B740"/></svg>
                  </span>
                  <span className="text-[13px] text-[#2B3040]">Featured Snippet</span>
                </div>
                <span className="text-[13px] font-semibold text-[#2B3040] tabular-nums">
                  {serpCounts[0]}
                </span>
              </div>

              {/* People Also Ask */}
              <div className="flex items-center justify-between rounded-[12px] border border-[#F1F4F9] bg-[#FBFCFE] px-3 py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#EAF4FF] border border-[#CFE1FF]">
                    <svg width="12" height="12" viewBox="0 0 24 24"><path d="M12 3l2.2 5.1 5.6.5-4.2 3.7 1.3 5.5L12 14.9 7.1 17.8l1.3-5.5-4.2-3.7 5.6-.5L12 3z" fill="#3B82F6"/></svg>
                  </span>
                  <span className="text-[13px] text-[#2B3040]">People Also Ask</span>
                </div>
                <span className="text-[13px] font-semibold text-[#2B3040] tabular-nums">
                  {serpCounts[1]}
                </span>
              </div>

              {/* Image Pack */}
              <div className="flex items-center justify-between rounded-[12px] border border-[#F1F4F9] bg-[#FBFCFE] px-3 py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#EAF8F1] border border-[#CBEBD9]">
                    <svg width="12" height="12" viewBox="0 0 24 24"><path d="M12 3l2.2 5.1 5.6.5-4.2 3.7 1.3 5.5L12 14.9 7.1 17.8l1.3-5.5-4.2-3.7 5.6-.5L12 3z" fill="#22C55E"/></svg>
                  </span>
                  <span className="text-[13px] text-[#2B3040]">Image Pack</span>
                </div>
                <span className="text-[13px] font-semibold text-[#2B3040] tabular-nums">
                  {serpCounts[2]}
                </span>
              </div>

              {/* Video Result */}
              <div className="flex items-center justify-between rounded-[12px] border border-[#F1F4F9] bg-[#FBFCFE] px-3 py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#FFF0F4] border border-[#FFE1EA]">
                    <svg width="12" height="12" viewBox="0 0 24 24"><path d="M12 3l2.2 5.1 5.6.5-4.2 3.7 1.3 5.5L12 14.9 7.1 17.8l1.3-5.5-4.2-3.7 5.6-.5L12 3z" fill="#D12C2C"/></svg>
                  </span>
                  <span className="text-[13px] text-[#2B3040]">Video Result</span>
                </div>
                <span className="text-[13px] font-semibold text-[#2B3040] tabular-nums">
                  {serpCounts[3]}
                </span>
              </div>

              {/* Knowledge Pannel */}
              <div className="flex items-center justify-between rounded-[12px] border border-[#F1F4F9] bg-[#FBFCFE] px-3 py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#F5EAFE] border border-[#E7D7FB]">
                    <svg width="12" height="12" viewBox="0 0 24 24"><path d="M12 3l2.2 5.1 5.6.5-4.2 3.7 1.3 5.5L12 14.9 7.1 17.8l1.3-5.5-4.2-3.7 5.6-.5L12 3z" fill="#8B5CF6"/></svg>
                  </span>
                  <span className="text-[13px] text-[#2B3040]">Knowledge Pannel</span>
                </div>
                <span className="text-[13px] font-semibold text-[#2B3040] tabular-nums">
                  {serpCounts[4]}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Ai SEO Matrix */}
          <div className="rounded-[14px] border border-[#E7EAF0] bg-[var(--input)] p-4 shadow-sm">
            {/* header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#FDE7B8] bg-[#FFF5D9] text-[#B98500]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3l2.2 5.1 5.6.5-4.2 3.7 1.3 5.5L12 14.9 7.1 17.8l1.3-5.5-4.2-3.7 5.6-.5L12 3z" fill="#F4B740"/>
                  </svg>
                </span>
                <span className="text-[13px] text-gray-700 leading-relaxed">Ai SEO Matrix</span>
                {/* use the same question-mark icon as other cards */}
                <HelpCircle size={14} className="text-[#9AA3B2]" />
              </div>
              {/* use the same filter/settings icon as other cards */}
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E7EAF0] text-[#6B7280]">
                <SlidersHorizontal size={16} />
              </span>
            </div>

            {/* 5 brand tiles w/ real logos from /public/brands */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-5">
              {[
                { name: "GPT",        ratio: "2/5", pages: "2.1k Pages", src: "/assets/gpt.svg" },
                { name: "GOOGLE Ai",  ratio: "2/5", pages: "1.9k Pages", src: "/assets/google.svg" },
                { name: "PERPLEXITY", ratio: "2/5", pages: "1.3k Pages", src: "/assets/perplexity.svg" },
                { name: "COPILOT",    ratio: "2/5", pages: "1.8k Pages", src: "/assets/copilot.svg" },
                { name: "GEMINI",     ratio: "2/5", pages: "2.3k Pages", src: "/assets/gemini.svg" },
              ].map((b) => (
                <div key={b.name} className="rounded-[12px] border border-[#EDF1F5] bg-[#FAFBFD] p-4 text-center">
                <Image
                  src={b.src}
                  alt={b.name}
                  width={36}
                  height={36}
                  className="mx-auto mb-2"
                />
                  <div className="text-[12px] text-[#6B7280]">{b.name}</div>
                  <div className="mt-1 text-[22px] font-semibold leading-none text-[#151824] tabular-nums">
                    {matrixNum}<span className="text-[#6B7280]">/5</span>
                  </div>
                  <div className="mt-1 text-[11px] text-[#8D96A8]">{b.pages}</div>
                </div>
              ))}
            </div>

            {/* footer */}
            <div className="mt-4 text-[12px] text-[#6B7280]">
              AI tool visibility and optimization scores
            </div>
          </div>
        </section>

        {/* Row: On-Page SEO Opportunities */}
        <h2 className="text-[16px] font-bold text-gray-900 mb-3 ml-1">
          On-Page SEO Opportunities
        </h2>

        <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Critical Issue */}
          <div className="flex items-center justify-between rounded-[18px] border border-[#E7EAF0] bg-[var(--input)] px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex shrink-0 aspect-square h-10 w-10 items-center justify-center rounded-full bg-[#EF3E5C] text-white">
                <Skull size={20} />
              </span>
              <div className="leading-tight">
                <div className="text-[11px] text-[#6B7280]">Critical Issue</div>
                <div className="mt-0.5 text-[20px] font-extrabold leading-none text-[#0F172A] tabular-nums">
                  {oppCounts[0]}
                </div>
                <div className="mt-1 text-[11px] font-medium text-[#DC2626] whitespace-nowrap">
                  32% more since last month
                </div>
              </div>
            </div>
            <button className="ml-4 inline-flex items-center gap-1 text-[11px] font-medium text-[#8D96A8] shrink-0 whitespace-nowrap">
              Fix Now <ChevronRight size={12} />
            </button>
          </div>

          {/* Card 2: Waring Issue */}
          <div className="flex items-center justify-between rounded-[18px] border border-[#E7EAF0] bg-[var(--input)] px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex shrink-0 aspect-square h-10 w-10 items-center justify-center rounded-full bg-[#F59E0B] text-white">
                <AlertTriangle size={20} />
              </span>
              <div className="leading-tight">
                <div className="text-[11px] text-[#6B7280]">Waring Issue</div>
                <div className="mt-0.5 text-[20px] font-extrabold leading-none text-[#0F172A] tabular-nums">
                  {oppCounts[1]}
                </div>
                <div className="mt-1 text-[11px] font-medium text-[#DC2626] whitespace-nowrap">
                  32% more since last month
                </div>
              </div>
            </div>
            <button className="ml-4 inline-flex items-center gap-1 text-[11px] font-medium text-[#8D96A8] shrink-0 whitespace-nowrap">
              Fix Now <ChevronRight size={12} />
            </button>
          </div>

          {/* Card 3: Recommendations */}
          <div className="flex items-center justify-between rounded-[18px] border border-[#E7EAF0] bg-[var(--input)] px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981] text-white">
                <Lightbulb size={20} />
              </span>
              <div className="leading-tight">
                <div className="text-[11px] text-[#6B7280]">Recommendations</div>
                <div className="mt-0.5 text-[20px] font-extrabold leading-none text-[#0F172A] tabular-nums">
                  {oppCounts[2]}
                </div>
                <div className="mt-1 text-[11px] font-medium text-[#16A34A] whitespace-nowrap">
                  +23%<span className="text-[#6B7280]">{' '}since last month</span>
                </div>
              </div>
            </div>
            <button className="ml-4 inline-flex items-center gap-1 text-[11px] font-medium text-[#8D96A8] shrink-0 whitespace-nowrap">
              View All <ChevronRight size={12} />
            </button>
          </div>

          {/* Card 4: Content Opportunities */}
          <div className="flex items-center justify-between rounded-[18px] border border-[#E7EAF0] bg-[var(--input)] px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#3B82F6] text-white">
                <FileText size={18} />
              </span>
              <div className="leading-tight">
                <div className="text-[11px] text-[#6B7280]">Content Opportunities</div>
                <div className="mt-0.5 text-[20px] font-extrabold leading-none text-[#0F172A] tabular-nums">
                  {oppCounts[3]}
                </div>
                <div className="mt-1 text-[11px] font-medium text-[#DC2626] whitespace-nowrap">
                  -32%<span className="text-[#6B7280]">{' '}since last month</span>
                </div>
              </div>
            </div>
            <button className="ml-4 inline-flex items-center gap-1 text-[11px] font-medium text-[#8D96A8] shrink-0 whitespace-nowrap">
              View All <ChevronRight size={12} />
            </button>
          </div>
        </section>

        {/* Top On-Page Content Opportunities */}
        <h2 className="text-[16px] font-bold text-gray-900 mb-3 ml-1">
          Top On-Page Content Opportunities
        </h2>

        <section className="mb-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)]">
          {/* BLOG column */}
          <div className="grid grid-rows-[auto_1fr_auto] gap-3">
            {/* header */}
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[#E7D7FB] bg-[#F5EAFE] text-[#7C3AED]">
                <BookOpen size={14} />
              </span>
              <span className="text-[12px] font-semibold tracking-wide text-[#2B3040]">BLOG</span>
              <HelpCircle size={14} className="text-[#9AA3B2]" />
            </div>

            {/* cards */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 items-stretch">
              <OpportunityCard
                title="How to Improve Site Speed"
                score={45}
                wordCount={1250}
                keywords={50}
                status="Published"
                progress={oppCardsProgress}
                className="h-full"
              />
              <OpportunityCard
                title="Complete Local SEO Guide"
                score={72}
                wordCount={2400}
                keywords={3}
                status="Draft"
                progress={oppCardsProgress}
                className="h-full"
              />
            </div>

            {/* view all pinned to bottom */}
            <div className="flex justify-end pt-1 px-4">
              <button className="inline-flex items-center gap-2 rounded-[12px] border border-[#DDE3ED] bg-[#FAFBFD] px-3 py-2 text-[12px] font-medium text-[#566072]">
                View all opportunity <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* vertical divider */}
          <div className="hidden lg:block w-px self-stretch bg-[#ECEFF5]" />

          {/* PAGES column */}
          <div className="grid grid-rows-[auto_1fr_auto] gap-3">
            {/* header */}
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[#FFD6E8] bg-[#FFE9F3] text-[#F43F5E]">
                <FileText size={14} />
              </span>
              <span className="text-[12px] font-semibold tracking-wide text-[#2B3040]">PAGES</span>
              <HelpCircle size={14} className="text-[#9AA3B2]" />
            </div>

            {/* cards */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <OpportunityCard
                title="How to Improve Site Speed"
                score={25}
                wordCount={1250}
                keywords={50}
                status="Published"
                progress={oppCardsProgress}
              />
              <OpportunityCard
                title="Complete Local SEO Guide"
                score={72}
                wordCount={2400}
                keywords={3}
                status="Draft"
                progress={oppCardsProgress}
              />
            </div>

            {/* view all pinned to bottom */}
            <div className="flex justify-end pt-1 px-4">
              <button className="inline-flex items-center gap-2 rounded-[12px] border border-[#DDE3ED] bg-[#FAFBFD] px-3 py-2 text-[12px] font-medium text-[#566072]">
                View all opportunity <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* ===== New on page SEO opportunity (table) ===== */}
        <h2 className="text-[16px] font-bold text-gray-900 mb-2 ml-1">
          New on page SEO opportunity
        </h2>
        <p className="ml-1 mb-4 text-[12px] text-[#6B7280]">
          *While it’s highly recommended to follow the AI’s suggested plan for optimal results,
          feel free to generate content based on your personal choice.
        </p>

        <div className="overflow-hidden rounded-[16px] border border-[#E7EAF0] bg-[var(--input)] shadow-sm">
          {/* table header */}
          <div className="hidden md:grid grid-cols-[2fr_1.1fr_1.1fr_1.3fr_2fr_1fr_1fr_1fr] items-center px-4 py-3 text-[12px] font-semibold text-[#4B5563] bg-[#F8FAFC]">
            <div>Keywords</div>
            <div>Type <span className="opacity-50">↑↓</span></div>
            <div>Search Volume</div>
            <div>SEO Difficulty</div>
            <div>Suggested topic</div>
            <div>Blog</div>
            <div>Page</div>
            <div>Preference</div>
          </div>

          {/* rows */}
          <ul className="divide-y divide-[#ECEFF5]">
            {seoRows.map((row, i) => (
              <li
                key={i}
                className="grid grid-cols-1 md:grid-cols-[2fr_1.1fr_1.1fr_1.3fr_2fr_1fr_1fr_1fr] items-center gap-3 px-4 py-3 text-[13px] hover:bg-[#FAFBFD]"
              >
                {/* Keywords */}
                <div className="flex items-center gap-2 text-[#2B3040]">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280]">
                    <Wifi size={14} />
                  </span>
                  <span className="truncate">{row.keyword}</span>
                </div>

                {/* Type pill */}
                <div>
                  <span className="inline-flex items-center gap-1 rounded-md border border-[#E7EAF0] bg-[#F6F8FB] px-2 py-0.5 text-[11px] text-[#6B7280]">
                    {row.type === "Informational" ? <FileText size={12} /> : <Link2 size={12} />}
                    {row.type}
                  </span>
                </div>

                {/* Search volume */}
                <div className="tabular-nums text-[#2B3040]">{row.volume.toLocaleString()}</div>

                {/* Difficulty w/ animated bar */}
                <div className="flex items-center gap-2 text-[#2B3040]">
                  <span className="tabular-nums">{row.difficulty}%</span>
                  <DifficultyBar value={row.difficulty} progress={seoTableProg} />
                </div>

                {/* Suggested topic (ellipsis) */}
                <div className="text-[#6B7280] truncate">The information shown here...</div>

                {/* Blog button */}
                <div>
                  <button className="inline-flex items-center justify-center rounded-full border border-[#BBD5FF] bg-[#F3F7FF] px-4 py-1.5 text-[12px] font-semibold text-[#3178C6]">
                    Generate
                  </button>
                </div>

                {/* Page button */}
                <div>
                  <button className="inline-flex items-center justify-center rounded-full border border-[#BBD5FF] bg-[#F3F7FF] px-4 py-1.5 text-[12px] font-semibold text-[#3178C6]">
                    Generate
                  </button>
                </div>

                {/* Preference icons */}
                <div className="flex items-center gap-3 text-[#A1A7B3]">
                  <ThumbsUp size={16} className="hover:text-[#6B7280] cursor-pointer" />
                  <ThumbsDown size={16} className="hover:text-[#6B7280] cursor-pointer" />
                </div>
              </li>
            ))}
          </ul>

          {/* footer */}
          <div className="flex justify-end border-t border-[#ECEFF5] bg-[#F8FAFC] px-4 py-3">
            <button className="inline-flex items-center gap-2 rounded-full border border-[#DDE3ED] bg-[var(--input)] px-3 py-1.5 text-[12px] text-[#566072] hover:bg-[#FAFBFD]">
              View all page issue <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}