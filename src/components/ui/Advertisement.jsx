import { useEffect, useMemo, useRef, useState } from "react";

export default function KgamifyAdCarousel({
  endpoint = "https://kgamify.in/championshipmaker/apis/fetch_advertisements.php",
  headers,
  className,
  autoPlay = true,
  interval = 4000,
  pauseOnHover = true,
  radius = 6,
}) {
  // 1-5: Always declared, same order
  const [ads, setAds] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const hoveredRef = useRef(false);

  // 6: Fetch effect — always declared
  useEffect(() => {
    const ac = new AbortController();
    async function load() {
      try {
        const res = await fetch(endpoint, {
          headers,
          signal: ac.signal,
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = await res.json();
        if (json && json.status === 200 && Array.isArray(json.data)) {
          setAds(json.data);
        }
      } catch {
      } finally {
        setLoaded(true);
      }
    }
    load();
    return () => ac.abort();
  }, [endpoint, headers]);

  // 7: Memo — always declared
  const slides = useMemo(() => {
    if (!Array.isArray(ads)) return [];
    return ads
      .filter(a => a && typeof a.ad_image === "string" && a.ad_image.trim().length > 0)
      .map(a => ({
        src: a.ad_image,
        alt: a.title || "Advertisement",
        href: (a.ad_link || "").trim(),
      }));
  }, [ads]);

  // 8: Autoplay effect — ALWAYS declared, with internal guards
  useEffect(() => {
    // If autoplay not desired or only one slide, do nothing but keep effect present
    if (!autoPlay || slides.length <= 1) return;

    // Set up interval
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (pauseOnHover && hoveredRef.current) return;
      setIndex(prev => (prev + 1) % slides.length);
    }, interval);

    // Cleanup
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay, interval, slides.length, pauseOnHover]); // effect exists every render

  // Rendering guard happens AFTER all hooks are declared
  if (!loaded || slides.length === 0) return null;

  const safeIndex = Math.min(index, slides.length - 1);
  const current = slides[safeIndex];

  const imgEl = (
    <img
      src={current.src}
      alt={current.alt}
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        objectFit: "cover",
        borderRadius: `${radius}px`,
      }}
      loading="lazy"
      decoding="async"
    />
  );

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", overflow: "hidden" }}
      onMouseEnter={() => { if (pauseOnHover) hoveredRef.current = true; }}
      onMouseLeave={() => { if (pauseOnHover) hoveredRef.current = false; }}
    >
      <div style={{ position: "relative" }}>
        {current.href ? (
          <a href={current.href} target="_blank" rel="noopener noreferrer">
            {imgEl}
          </a>
        ) : (
          imgEl
        )}

        {slides.length > 1 && (
          <>
            <button aria-label="Previous" onClick={prev} style={controlBtnStyle("left")}>‹</button>
            <button aria-label="Next" onClick={next} style={controlBtnStyle("right")}>›</button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 8,
            display: "flex",
            justifyContent: "center",
            gap: 8,
            pointerEvents: "auto",
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                border: 0,
                padding: 0,
                background: i === safeIndex ? "#1f6feb" : "rgba(255,255,255,0.7)",
                outline: "2px solid rgba(0,0,0,0.15)",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function controlBtnStyle(side) {
  const base = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.4)",
    color: "#fff",
    border: "none",
    width: 32,
    height: 32,
    borderRadius: "50%",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    lineHeight: 1,
    fontSize: 20,
  };
  if (side === "left") return { ...base, left: 8 };
  if (side === "right") return { ...base, right: 8 };
  return base;
}
