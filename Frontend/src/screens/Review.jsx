import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { motion, useInView, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

/* ─────────────────────────────────────────────
   Detect low-end / mobile ONCE at module load.
   Avoids repeated checks on every render.
───────────────────────────────────────────── */
const IS_MOBILE       = typeof window !== "undefined" && window.innerWidth < 768;
const PREFERS_REDUCED = typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const LIGHT_MODE = IS_MOBILE || PREFERS_REDUCED;

/* ── Injected styles ── */
const injectStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

  .poppins { font-family:'Poppins',sans-serif; }
  .jakarta { font-family:'Plus Jakarta Sans',sans-serif; }

  @keyframes scrollLeft  { from{transform:translateX(0)}   to{transform:translateX(-50%)} }
  @keyframes scrollRight { from{transform:translateX(-50%)} to{transform:translateX(0)}   }
  @keyframes pulseGlow   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.65)} }
  @keyframes floatUp     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
  @keyframes spin        { to{transform:rotate(360deg)} }
  @keyframes toastBar    { from{width:100%} to{width:0%} }

  /* Slower marquee on mobile to reduce CPU pressure */
  .track-fwd  { animation: scrollLeft  ${LIGHT_MODE ? "60s" : "40s"} linear infinite; }
  .track-back { animation: scrollRight ${LIGHT_MODE ? "72s" : "48s"} linear infinite; }
  .marquee-wrap:hover .track-fwd,
  .marquee-wrap:hover .track-back { animation-play-state:paused; }

  .pulse-dot { animation: pulseGlow 2s infinite; }
  .spin-anim { animation: spin .7s linear infinite; }

  /* Float animations: disabled on mobile to save 3 concurrent GPU animations */
  ${LIGHT_MODE ? `
    .float-1, .float-2, .float-3 { animation: none; }
  ` : `
    .float-1 { animation: floatUp 7s ease-in-out infinite; }
    .float-2 { animation: floatUp 7s ease-in-out 2.3s infinite; }
    .float-3 { animation: floatUp 7s ease-in-out 4.6s infinite; }
  `}

  /* r-card: will-change removed globally — only triggered on hover via JS */
  .r-card {
    transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
  }
  /* Hover effects scoped to true pointer devices only */
  @media (hover: hover) {
    .r-card:hover {
      transform: translateY(-7px) scale(1.01);
      border-color: rgba(0,200,212,.35) !important;
      box-shadow: 0 24px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(0,200,212,.12);
    }
    .star-s:hover { transform:scale(1.25); }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 32px rgba(0,200,212,.4);
    }
  }

  .star-s { transition: color .12s, transform .12s; cursor:pointer; user-select:none; }
  .btn-primary { transition: transform .18s ease, box-shadow .18s ease, opacity .18s; }
  .btn-primary:active:not(:disabled) { transform: scale(.98); }
`;

/* ── Style maps ── */
const CARD_V = ["blue","navy","green","purple","indigo"];
const AV_V   = ["teal","blue","green","purple","indigo","sky"];
const TAG_V  = ["teal","blue","green","purple"];

const cardBg = {
  blue:   "from-[#0f1e3a] to-[#132038]",
  navy:   "from-[#0e1a30] to-[#0c2040]",
  green:  "from-[#0d1f20] to-[#0e2d2a]",
  purple: "from-[#1a0f2e] to-[#1e1545]",
  indigo: "from-[#1a1530] to-[#211545]",
};
const cardTop = {
  blue:"from-cyan-400 to-blue-500", navy:"from-blue-500 to-violet-500",
  green:"from-emerald-400 to-cyan-400", purple:"from-purple-500 to-violet-500",
  indigo:"from-violet-500 to-blue-500",
};
const tagCls = {
  teal:  "bg-cyan-900/40 text-cyan-300 border-cyan-700/40",
  blue:  "bg-blue-900/40 text-blue-300 border-blue-700/40",
  green: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
  purple:"bg-purple-900/40 text-purple-300 border-purple-700/40",
};
const avCls = {
  teal:"from-cyan-400 to-blue-600", blue:"from-blue-400 to-blue-700",
  green:"from-emerald-400 to-teal-700", purple:"from-purple-500 to-violet-700",
  indigo:"from-violet-500 to-purple-800", sky:"from-sky-400 to-blue-700",
};

function hashPick(str, arr) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffff;
  return arr[h % arr.length];
}

function decorate(r) {
  const s = String(r._id || r.id || r.name || Math.random());
  return { ...r, _cs: hashPick(s, CARD_V), _as: hashPick(s+"av", AV_V), _ts: hashPick(s+"tg", TAG_V) };
}

/* ══════════════════════════════════════════
   ── Custom Toast System ──
   ══════════════════════════════════════════ */

const TOAST_CONFIG = {
  error: {
    icon: "✕",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    border: "border-red-500/25",
    bar: "bg-gradient-to-r from-red-500 to-rose-500",
    title: "text-red-300",
  },
  success: {
    icon: "✦",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
    border: "border-cyan-500/25",
    bar: "bg-gradient-to-r from-cyan-400 to-blue-500",
    title: "text-cyan-300",
  },
  info: {
    icon: "ℹ",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    border: "border-blue-500/25",
    bar: "bg-gradient-to-r from-blue-400 to-violet-500",
    title: "text-blue-300",
  },
};

/* Single Toast Item
   - No framer-motion `layout` prop → avoids full layout recalculation
   - Progress bar uses pure CSS animation → zero JS on the hot path         */
function ToastItem({ id, type = "info", message, onRemove }) {
  const cfg = TOAST_CONFIG[type] ?? TOAST_CONFIG.info;

  useEffect(() => {
    const t = setTimeout(() => onRemove(id), 3500);
    return () => clearTimeout(t);
  }, [id, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.93 }}
      animate={{ opacity: 1, y: 0,   scale: 1     }}
      exit={{    opacity: 0, y: -12, scale: 0.92  }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex items-start gap-3 w-full max-w-sm
        bg-[#060e1e]/95
        border ${cfg.border}
        rounded-2xl px-4 py-3.5 overflow-hidden
        shadow-[0_16px_48px_rgba(0,0,0,0.6)]`}
    >
      {/* CSS-driven progress bar — no JS animation frame cost */}
      <div
        className={`absolute bottom-0 left-0 h-[2.5px] ${cfg.bar} rounded-b-2xl`}
        style={{ animation: "toastBar 3.5s linear forwards" }}
      />

      {/* icon */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl ${cfg.iconBg} flex items-center justify-center`}>
        <span className={`${cfg.iconColor} text-sm font-bold`}>{cfg.icon}</span>
      </div>

      {/* message */}
      <div className="flex-1 pt-0.5 min-w-0">
        <p className={`poppins text-[0.78rem] font-semibold leading-snug ${cfg.title}`}>
          {message}
        </p>
      </div>

      {/* close */}
      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors text-xs mt-0.5 leading-none"
      >
        ✕
      </button>
    </motion.div>
  );
}

/* Toast Container — no layout animation on wrapper */
function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto w-full max-w-sm">
            <ToastItem {...t} onRemove={onRemove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* useToast — stable shorthands via useMemo, no re-renders on push */
function useToast() {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const push = useCallback((type, message) => {
    const id = `t-${Date.now()}`;
    setToasts(prev => [{ id, type, message }, ...prev].slice(0, 4));
  }, []);

  /* Stable object — won't trigger re-renders in consumers */
  const toast = useMemo(() => ({
    error:   (msg) => push("error",   msg),
    success: (msg) => push("success", msg),
    info:    (msg) => push("info",    msg),
  }), [push]);

  return { toasts, toast, remove };
}

/* ── Reveal wrapper ──
   Mobile: pure opacity fade (no translate) → no layout/paint cost.
   Desktop: full directional animation as before.
─────────────────────────────────────────── */
const VARIANTS_FULL = {
  up:    { hidden:{opacity:0,y:44},     visible:{opacity:1,y:0}    },
  down:  { hidden:{opacity:0,y:-44},    visible:{opacity:1,y:0}    },
  left:  { hidden:{opacity:0,x:-56},    visible:{opacity:1,x:0}    },
  right: { hidden:{opacity:0,x:56},     visible:{opacity:1,x:0}    },
  scale: { hidden:{opacity:0,scale:.88},visible:{opacity:1,scale:1}},
};
const VARIANTS_LITE = {
  up:    { hidden:{opacity:0}, visible:{opacity:1} },
  down:  { hidden:{opacity:0}, visible:{opacity:1} },
  left:  { hidden:{opacity:0}, visible:{opacity:1} },
  right: { hidden:{opacity:0}, visible:{opacity:1} },
  scale: { hidden:{opacity:0}, visible:{opacity:1} },
};
const EASE = [0.22, 1, 0.36, 1];

function Reveal({ children, delay = 0, dir = "up", className = "" }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const variants = LIGHT_MODE ? VARIANTS_LITE : VARIANTS_FULL;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants[dir]}
      transition={{
        duration: LIGHT_MODE ? 0.3 : 0.6,
        ease: EASE,
        delay: LIGHT_MODE ? delay * 0.4 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── ReviewCard (memoized) ── */
const ReviewCard = memo(function ReviewCard({ r }) {
  const name     = r.name    || "Anonymous";
  const initials = name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const stars    = Number(r.rating ?? r.stars ?? 5);
  const role     = r.role    || r.major || "Student";
  const tag      = r.tag     || "Reviewer";
  const text     = r.message || r.text  || r.review || "";

  return (
    <div
      className={`r-card flex-shrink-0 w-[200px] sm:w-64 md:w-80 rounded-2xl border border-white/[0.07] relative overflow-hidden bg-gradient-to-br ${cardBg[r._cs]}`}
      style={{ boxShadow:"0 8px 36px rgba(0,0,0,.42)" }}
    >
      <div className={`absolute top-0 left-5 right-5 h-[2px] rounded-b bg-gradient-to-r ${cardTop[r._cs]}`} />
      {/* Shimmer overlay skipped on mobile (extra gradient layer = extra composite) */}
      {!LIGHT_MODE && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] to-transparent pointer-events-none rounded-2xl" />
      )}

      <div className="p-3.5 sm:p-5 pt-5 sm:pt-6 flex flex-col gap-2.5 relative z-10">
        {/* stars + tag */}
        <div className="flex items-center justify-between">
          <div className="flex gap-[3px]">
            {[1,2,3,4,5].map(i=>(
              <span key={i} className={`text-[13px] ${i<=stars?"text-yellow-400":"text-slate-700"}`}>★</span>
            ))}
          </div>
          <span className={`text-[0.6rem] font-bold tracking-widest uppercase px-2.5 py-[3px] rounded-full border ${tagCls[r._ts]}`}>
            {tag}
          </span>
        </div>

        {/* quote */}
        <p className="text-[0.78rem] sm:text-[0.85rem] leading-relaxed text-slate-300/90 relative min-h-[56px] sm:min-h-[66px]">
          <span className="text-4xl leading-none text-cyan-400/15 font-black absolute -top-2 -left-1 poppins">"</span>
          <span className="relative z-10 pl-3">{text}</span>
        </p>

        <div className="h-px bg-white/[0.06]" />

        {/* author */}
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avCls[r._as]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {initials}
          </div>
          <div>
            <p className="text-[0.82rem] font-semibold text-slate-100 poppins leading-tight">{name}</p>
            <p className="text-[0.72rem] text-slate-500 mt-0.5">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

/* ── MarqueeRow (memoized) ──
   Doubled array memoized so it's not rebuilt each render.
─────────────────────────────────────────── */
const MarqueeRow = memo(function MarqueeRow({ reviews, direction }) {
  const doubled = useMemo(() => [...reviews, ...reviews], [reviews]);
  if (!reviews.length) return null;
  return (
    <div className={`flex gap-2.5 sm:gap-4 w-max py-2 ${direction === "fwd" ? "track-fwd" : "track-back"}`}>
      {doubled.map((r, i) => (
        <ReviewCard key={`${r._id||r.id||i}-${i}`} r={r} />
      ))}
    </div>
  );
});

/* ── StarPicker ── */
function StarPicker({ value, onChange }) {
  const [hov, setHov] = useState(0);
  return (
    <div className="flex gap-1 mt-1" onMouseLeave={()=>setHov(0)}>
      {[1,2,3,4,5].map(i=>(
        <span
          key={i}
          className={`star-s text-[1.6rem] ${i<=(hov||value)?"text-yellow-400":"text-slate-600"}`}
          onMouseEnter={()=>setHov(i)}
          onClick={()=>onChange(i)}
        >★</span>
      ))}
    </div>
  );
}

/* ── Field wrapper ── */
function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-[0.7rem] font-bold tracking-widest uppercase text-blue-300/80 mb-1.5">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-[0.72rem] mt-1">{error}</p>}
    </div>
  );
}

const INPUT_CLS = "w-full bg-white/[0.05] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-blue-400/35 outline-none transition duration-200 focus:bg-cyan-950/30 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20";

/* ── Background wrappers ──────────────────────────────────────────────────
   ParallaxBg: full useScroll + useSpring (desktop only).
   StaticBg:   plain <section>, no scroll listener, no spring (mobile).
   This completely eliminates the scroll handler + spring overhead on mobile.
─────────────────────────────────────────────────────────────────────────── */
function ParallaxBg({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rawBg = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const bgY   = useSpring(rawBg, { stiffness: 70, damping: 18, mass: 0.7 });
  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-[#050B16] jakarta">
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0 opacity-[0.15] z-0 select-none">
        <span className="absolute top-20 left-14 text-2xl float-1">⭐</span>
        <span className="absolute top-[38%] right-10 text-xl float-2">💬</span>
        <span className="absolute bottom-32 left-20 text-xl float-3">🎓</span>
      </motion.div>
      {children}
    </section>
  );
}

function StaticBg({ children }) {
  return (
    <section className="relative w-full overflow-hidden bg-[#050B16] jakarta">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] z-0 select-none">
        <span className="absolute top-20 left-14 text-2xl">⭐</span>
        <span className="absolute top-[38%] right-10 text-xl">💬</span>
        <span className="absolute bottom-32 left-20 text-xl">🎓</span>
      </div>
      {children}
    </section>
  );
}

/* ══════════════════════════════════════════
   ── Main Component ──
   ══════════════════════════════════════════ */
export default function CollegianXReviews() {
  const token = localStorage.getItem("token");

  const { toasts, toast, remove } = useToast();

  const [reviews,    setReviews]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [form,       setForm]       = useState({ name:"", role:"", rating:5, tag:"", message:"" });
  const [errors,     setErrors]     = useState({});

  useEffect(() => { loadReviews(); }, []);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/reviews`, {
        headers: token ? { Authorization:`Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const arr  = Array.isArray(json) ? json : (json.reviews ?? json.data ?? []);
      setReviews(arr.map(decorate));
    } catch {
      toast.error("Failed to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleSubmit = useCallback(async () => {
    if (!token) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    const errs = {};
    if (!form.name.trim())    errs.name    = "Name is required.";
    if (!form.message.trim()) errs.message = "Review is required.";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const body = {
        name:    form.name.trim(),
        role:    form.role.trim()    || "Student",
        rating:  form.rating,
        tag:     form.tag.trim()     || "Reviewer",
        message: form.message.trim(),
      };
      const res = await fetch(`${API_URL}/api/reviews`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          ...(token ? { Authorization:`Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      const json    = await res.json();
      const created = decorate(json.review ?? json.data ?? json);
      setReviews(prev=>[created, ...prev]);
      setForm({ name:"", role:"", rating:5, tag:"", message:"" });
      setErrors({});
      setSubmitted(true);
      toast.success("Review submitted — thank you!");
      setTimeout(()=>setSubmitted(false), 3000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [form, token]);

  const updateField = useCallback((key, val) => {
    setForm(p=>({...p,[key]:val}));
    setErrors(p=>({...p,[key]:undefined}));
  }, []);

  /* Memoized derived values — no unnecessary recalculation */
  const reversed  = useMemo(() => [...reviews].reverse(), [reviews]);
  const avgRating = useMemo(() =>
    reviews.length
      ? (reviews.reduce((s,r)=>s+Number(r.rating??r.stars??5),0)/reviews.length).toFixed(1)
      : "—"
  , [reviews]);

  const Wrapper = LIGHT_MODE ? StaticBg : ParallaxBg;

  return (
    <>
      <style>{injectStyles}</style>
      <ToastContainer toasts={toasts} onRemove={remove} />

      <Wrapper>
        {/* Dark fades */}
        <div className="pointer-events-none absolute top-0 inset-x-0 h-40 z-20"
          style={{ background:"linear-gradient(to bottom,#020810,transparent)" }} />
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-40 z-20"
          style={{ background:"linear-gradient(to top,#020810,transparent)" }} />

        <div className="relative z-10">

          {/* ── HEADING ── */}
          <div className="text-center pt-20 pb-10 px-6">
            <Reveal dir="down">
              <div className="inline-flex items-center gap-2 bg-cyan-900/20 border border-cyan-700/25 rounded-full px-4 py-1.5 mb-5">
                <span className="pulse-dot w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                <span className="text-cyan-400 text-[0.7rem] font-bold tracking-[0.12em] uppercase poppins">Live Reviews</span>
              </div>
            </Reveal>

            <Reveal delay={0.1} dir="up">
              <h2 className="poppins text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
                What Students Are{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Saying About Us
                </span>
              </h2>
            </Reveal>

            <Reveal delay={0.18} dir="up">
              <p className="text-blue-200/70 text-sm max-w-md mx-auto leading-relaxed">
                Real voices from the Collegian&nbsp;X community — scholars, builders, and leaders shaping tomorrow.
              </p>
            </Reveal>
          </div>

          {/* ── STATS ── */}
          <div className="flex justify-center gap-10 md:gap-20 pb-12 px-6 flex-wrap">
            {[
              { num: loading ? "—" : String(reviews.length), label: "Reviews"    },
              { num: loading ? "—" : `${avgRating}★`,        label: "Avg Rating" },
              { num: "100%",                                   label: "Recommend"  },
            ].map((s,i)=>(
              <Reveal key={s.label} delay={0.12+i*0.09} dir="scale">
                <div className="text-center">
                  <p className="poppins text-3xl font-extrabold text-cyan-400 tabular-nums">{s.num}</p>
                  <p className="text-blue-300/50 text-[0.68rem] uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* ── MARQUEE ── */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="spin-anim w-10 h-10 rounded-full border-4 border-slate-700 border-t-cyan-400" />
            </div>
          ) : reviews.length === 0 ? (
            <Reveal dir="up">
              <p className="text-center text-blue-300/30 text-sm py-16 italic">
                No reviews yet — be the first to share!
              </p>
            </Reveal>
          ) : (
            <div className="marquee-wrap relative overflow-hidden pb-3">
              <div className="pointer-events-none absolute left-0 inset-y-0 w-28 z-10"
                style={{ background:"linear-gradient(90deg,#050B16,transparent)" }} />
              <div className="pointer-events-none absolute right-0 inset-y-0 w-28 z-10"
                style={{ background:"linear-gradient(270deg,#050B16,transparent)" }} />

              <Reveal dir="left">
                <div className="mb-4"><MarqueeRow reviews={reviews} direction="fwd" /></div>
              </Reveal>
              <Reveal dir="right" delay={0.08}>
                <MarqueeRow reviews={reversed} direction="back" />
              </Reveal>
            </div>
          )}

          {/* ── FORM ── */}
          <Reveal dir="up" delay={0.05} className="flex justify-center px-4 sm:px-6 py-16">
            <div className="w-full max-w-2xl">

              <Reveal dir="up" delay={0.1}>
                <div className="text-center mb-8">
                  <h3 className="poppins text-2xl font-bold text-white mb-1.5">Share Your Experience</h3>
                  <p className="text-blue-200/60 text-sm">Your voice helps the Collegian&nbsp;X community grow.</p>
                </div>
              </Reveal>

              <Reveal dir="up" delay={0.18}>
                {/* backdrop-blur-xl skipped on mobile — one of the most GPU-heavy CSS properties */}
                <div className={`relative border border-white/[0.08] rounded-3xl p-7 md:p-9 overflow-hidden
                  ${LIGHT_MODE ? "bg-[#0a1628]" : "bg-white/[0.035] backdrop-blur-xl"}`}
                >
                  {/* rainbow bar */}
                  <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 rounded-t-3xl" />
                  {/* glow blob skipped on mobile (blur filter = expensive) */}
                  {!LIGHT_MODE && (
                    <div className="pointer-events-none absolute -top-12 -right-12 w-44 h-44 rounded-full bg-cyan-400/[0.04] blur-2xl" />
                  )}

                  {/* Success banner */}
                  {submitted && (
                    <motion.div
                      initial={{ opacity:0, y:-12 }}
                      animate={{ opacity:1, y:0 }}
                      className="mb-5 flex items-center gap-2.5 bg-cyan-900/30 border border-cyan-700/30 rounded-xl px-4 py-3"
                    >
                      <span className="text-cyan-400 text-lg">✦</span>
                      <p className="text-cyan-300 text-sm font-semibold poppins">Review submitted — thank you!</p>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">

                    <Field label="Full Name" required error={errors.name}>
                      <input
                        value={form.name}
                        onChange={e=>updateField("name",e.target.value)}
                        placeholder="e.g. Aiden Mitchell"
                        className={`${INPUT_CLS} ${errors.name?"border-red-500/60":"border-white/[0.08]"}`}
                      />
                    </Field>

                    <Field label="Role / Major">
                      <input
                        value={form.role}
                        onChange={e=>updateField("role",e.target.value)}
                        placeholder="e.g. Computer Science"
                        className={`${INPUT_CLS} border-white/[0.08]`}
                      />
                    </Field>

                    <Field label="Your Title / Tag">
                      <input
                        value={form.tag}
                        onChange={e=>updateField("tag",e.target.value)}
                        placeholder="e.g. Alumni, Scholar"
                        className={`${INPUT_CLS} border-white/[0.08]`}
                      />
                    </Field>

                    <Field label="Your Rating">
                      <StarPicker value={form.rating} onChange={v=>updateField("rating",v)} />
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Your Review" required error={errors.message}>
                        <textarea
                          rows={4}
                          value={form.message}
                          onChange={e=>updateField("message",e.target.value)}
                          placeholder="Tell us about your Collegian X experience…"
                          className={`${INPUT_CLS} resize-y ${errors.message?"border-red-500/60":"border-white/[0.08]"}`}
                        />
                      </Field>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-primary mt-5 w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white poppins font-bold text-sm tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ boxShadow:"0 4px 18px rgba(0,200,212,.28)" }}
                  >
                    {submitting ? (
                      <>
                        <span className="spin-anim w-4 h-4 rounded-full border-2 border-white/30 border-t-white inline-block" />
                        Submitting…
                      </>
                    ) : "Submit Review →"}
                  </button>
                </div>
              </Reveal>

            </div>
          </Reveal>

        </div>
      </Wrapper>
    </>
  );
}