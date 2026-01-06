import { useState, useEffect, useRef, useMemo } from "react";

const START_DATE = "2025-01-03";

const App = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    // Detect low-end device
    const cores = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory || 4;
    setIsLowEnd(cores <= 4 || memory <= 4);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 overflow-hidden text-slate-800">
      {!unlocked ? (
        <LockScreen onUnlock={() => setUnlocked(true)} />
      ) : (
        <MainExperience isLowEnd={isLowEnd} />
      )}
      {!isLowEnd && <FloatingParticles />}
    </div>
  );
};

const LockScreen = ({ onUnlock }) => {
  const [hearts, setHearts] = useState([false, false, false, false]);
  const allActive = hearts.every((h) => h);

  useEffect(() => {
    if (allActive) {
      const timer = setTimeout(onUnlock, 1500);
      return () => clearTimeout(timer);
    }
  }, [allActive, onUnlock]);

  return (
    <div className="lock-screen min-h-screen flex flex-col items-center justify-center p-8 relative">
      <div className="animated-bg" />

      <div className="relative z-10 text-center space-y-8 lock-content">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-4">
            Hey Nathasha ✨
          </h1>
          <p className="text-rose-400 text-lg">Unlock your surprise...</p>
        </div>

        {!allActive ? (
          <div className="space-y-4 fade-in-up">
            <p className="text-rose-600 font-medium">
              Tap all the hearts to unlock 💝
            </p>
            <div className="flex gap-4 justify-center">
              {hearts.map((active, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setHearts((prev) => {
                      const n = [...prev];
                      n[i] = true;
                      return n;
                    })
                  }
                  className={`heart-btn ${active ? "active" : ""}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {active ? "❤️" : "🤍"}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-3xl font-bold text-rose-500 scale-in">
            Opening... 💕
          </div>
        )}
      </div>
    </div>
  );
};

const MainExperience = ({ isLowEnd }) => {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll overflow-x-hidden snap-y snap-mandatory scroll-smooth main-container"
      style={{
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
      }}
    >
      <HeroSection scrollProgress={scrollProgress} isLowEnd={isLowEnd} />
      <TimelineSection isLowEnd={isLowEnd} />
      <GallerySection isLowEnd={isLowEnd} />
      <LetterSection isLowEnd={isLowEnd} />
      <FinalSection />
    </div>
  );
};

const HeroSection = ({ scrollProgress, isLowEnd }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTime = () => {
      const start = new Date(START_DATE);
      const now = new Date();
      const diff = now - start;

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const opacity = Math.max(0, 1 - scrollProgress * 5);
  const scale = Math.max(0.8, 1 - scrollProgress * 1);

  return (
    <section
      className="min-h-screen snap-start flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden fade-in"
      style={{
        opacity,
        transform: `scale(${scale})`,
        transition: "opacity 0.1s, transform 0.1s",
      }}
    >
      <div className="text-center space-y-6 md:space-y-8 max-w-full">
        <h2 className="text-5xl md:text-8xl font-black gradient-text-animated px-2 leading-tight">
          Nadun & Nathasha
        </h2>

        <p className="text-xl md:text-2xl text-rose-400 font-light">
          Forever & Always
        </p>

        <div className={`timer-card ${!isLowEnd ? "glass" : "glass-light"}`}>
          <p className="text-xs md:text-sm uppercase tracking-widest text-rose-400 mb-4 md:mb-6 font-semibold">
            Together for
          </p>
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            <TimerBox val={timeLeft.days} label="Days" />
            <TimerBox val={timeLeft.hours} label="Hours" />
            <TimerBox val={timeLeft.minutes} label="Mins" />
            <TimerBox val={timeLeft.seconds} label="Secs" />
          </div>
        </div>

        <p className="text-rose-300 text-xs md:text-sm pt-4 bounce">
          Scroll to explore our journey ↓
        </p>
      </div>
    </section>
  );
};

const TimerBox = ({ val, label }) => (
  <div className="timer-box">
    <span className="timer-value" key={val}>
      {val}
    </span>
    <span className="timer-label">{label}</span>
  </div>
);

const TimelineSection = ({ isLowEnd }) => {
  const [visible, setVisible] = useState({});
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({
              ...prev,
              [entry.target.dataset.index]: true,
            }));
          }
        });
      },
      { threshold: 0.2, rootMargin: "-50px" }
    );

    const items = ref.current?.querySelectorAll("[data-index]");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8 py-20"
    >
      <div className="max-w-4xl w-full space-y-8 md:space-y-12">
        <h3 className="text-4xl md:text-5xl font-bold text-center gradient-text mb-8 md:mb-16">
          Our Journey ✨
        </h3>

        {memories.map((memory, index) => (
          <div
            key={index}
            data-index={index}
            className={`timeline-card ${visible[index] ? "visible" : ""} ${
              index % 2 === 0 ? "left" : "right"
            }`}
          >
            <div className="timeline-icon">{memory.icon}</div>
            <div
              className={`timeline-content ${
                !isLowEnd ? "glass" : "glass-light"
              }`}
            >
              <h4 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                {memory.title}
              </h4>
              <p className="text-rose-500 font-medium mb-2 text-sm md:text-base">
                {memory.date}
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                {memory.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const GallerySection = ({ isLowEnd }) => {
  const photos = [
    {
      emoji: "📸",
      caption: "Our First Selfie",
      color: "from-pink-400 to-rose-500",
    },
    {
      emoji: "🌅",
      caption: "Sunset Together",
      color: "from-orange-400 to-pink-500",
    },
    {
      emoji: "🎭",
      caption: "Movie Night",
      color: "from-purple-400 to-pink-500",
    },
    { emoji: "🍝", caption: "Dinner Date", color: "from-red-400 to-rose-500" },
  ];

  const [visible, setVisible] = useState({});
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({
              ...prev,
              [entry.target.dataset.index]: true,
            }));
          }
        });
      },
      { threshold: 0.3 }
    );

    const items = ref.current?.querySelectorAll("[data-index]");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8 py-20">
      <div className="max-w-5xl w-full">
        <h3 className="text-4xl md:text-5xl font-bold text-center gradient-text mb-8 md:mb-16">
          Our Memories 💕
        </h3>

        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {photos.map((photo, index) => (
            <div
              key={index}
              data-index={index}
              className={`gallery-card bg-gradient-to-br ${photo.color} ${
                visible[index] ? "visible" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl md:text-6xl mb-2 md:mb-4">
                {photo.emoji}
              </div>
              <p className="text-white font-semibold text-xs md:text-base">
                {photo.caption}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 mt-8 italic text-sm fade-in">
          Replace these with your actual photos! 📷
        </p>
      </div>
    </section>
  );
};

const LetterSection = ({ isLowEnd }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8">
      <div
        ref={ref}
        className={`letter-card ${!isLowEnd ? "glass" : "glass-light"} ${
          visible ? "visible" : ""
        }`}
      >
        <div className="text-5xl md:text-6xl text-center mb-6 md:mb-8 scale-in">
          💌
        </div>

        <div className="space-y-4 md:space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
          <p className="letter-line">Dear Nathasha,</p>

          <p className="letter-line" style={{ animationDelay: "0.2s" }}>
            One year ago, you walked into my life and everything changed. Every
            moment with you feels like magic, and I still can't believe how
            lucky I am to call you mine.
          </p>

          <p className="letter-line" style={{ animationDelay: "0.4s" }}>
            Thank you for all the laughter, adventures, and endless love. Here's
            to many more years of creating beautiful memories together.
          </p>

          <p
            className="letter-line text-right font-semibold text-rose-600"
            style={{ animationDelay: "0.6s" }}
          >
            Forever yours,
            <br />
            Nadun ❤️
          </p>
        </div>
      </div>
    </section>
  );
};

const FinalSection = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8"
    >
      <div
        className={`text-center space-y-6 md:space-y-8 ${
          visible ? "final-visible" : ""
        }`}
      >
        <div className="final-heart">💖</div>

        <h2 className="text-4xl md:text-6xl font-black gradient-text px-4">
          Happy 1st Anniversary My love!
        </h2>

        <p className="text-xl md:text-2xl text-rose-400">
          To many more adventures together 🌹
        </p>
      </div>
    </section>
  );
};

const FloatingParticles = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 5 + 15,
      })),
    []
  );

  const emojis = ["✨", "💕", "💖", "🌹", "💝"];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {emojis[p.id % emojis.length]}
        </div>
      ))}
    </div>
  );
};

const memories = [
  {
    title: "First Date",
    date: "January 3rd, 2024",
    icon: "☕",
    description:
      "The day everything started. Coffee, conversation, and instant connection.",
  },
  {
    title: "First Trip Together",
    date: "March 15th, 2024",
    icon: "🚗",
    description: "Our adventure to remember. New places, endless laughter.",
  },
  {
    title: "Your Birthday",
    date: "October 27th, 2024",
    icon: "🎂",
    description: "Celebrating you and making your day as special as you are.",
  },
  {
    title: "Our First Anniversary",
    date: "January 3rd, 2025",
    icon: "💑",
    description:
      "One year of love, laughter, and beautiful memories. Here's to forever.",
  },
];

export default App;

// Add styles to document head
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.5); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-100px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(100px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    @keyframes particleFloat {
      0% { transform: translateY(100vh) translateX(0); opacity: 0; }
      10% { opacity: 0.6; }
      90% { opacity: 0.6; }
      100% { transform: translateY(-10vh) translateX(20px); opacity: 0; }
    }

    @keyframes heartBeat {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(1.2) rotate(5deg); }
      75% { transform: scale(1.2) rotate(-5deg); }
    }

    @keyframes bgMove {
      0% { background-position: 20% 50%; }
      50% { background-position: 80% 50%; }
      100% { background-position: 20% 50%; }
    }

    .gradient-text {
      background: linear-gradient(to right, #ec4899, #f43f5e, #a855f7);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .gradient-text-animated {
      background: linear-gradient(to right, #ec4899, #f43f5e, #a855f7, #ec4899);
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: gradientShift 5s ease infinite;
    }

    .glass {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .glass-light {
      background: rgba(255, 255, 255, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .lock-screen {
      animation: fadeInUp 0.6s ease-out;
    }

    .lock-content > * {
      animation: fadeInUp 0.8s ease-out backwards;
    }

    .lock-content > *:nth-child(1) { animation-delay: 0.1s; }
    .lock-content > *:nth-child(2) { animation-delay: 0.3s; }

    .animated-bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%);
      animation: bgMove 8s ease-in-out infinite;
    }

    .heart-btn {
      width: 4rem;
      height: 4rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: rgba(255, 255, 255, 0.5);
      border: 2px solid #fecdd3;
      cursor: pointer;
      animation: scaleIn 0.5s ease-out backwards;
    }

    @media (min-width: 768px) {
      .heart-btn {
        width: 5rem;
        height: 5rem;
      }
    }

    .heart-btn:hover {
      transform: scale(1.15) rotate(10deg);
    }

    .heart-btn:active {
      transform: scale(0.85);
    }

    .heart-btn.active {
      background: linear-gradient(to bottom right, #f472b6, #f43f5e);
      box-shadow: 0 10px 25px rgba(236, 72, 153, 0.4);
    }

    .fade-in {
      animation: fadeInUp 1s ease-out;
    }

    .fade-in-up {
      animation: fadeInUp 0.6s ease-out 0.5s backwards;
    }

    .scale-in {
      animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .bounce {
      animation: bounce 2s ease-in-out infinite;
    }

    .timer-card {
      padding: 2rem;
      border-radius: 1.5rem;
      max-width: 90%;
      margin: 0 auto;
      transition: transform 0.3s ease;
    }

    @media (min-width: 768px) {
      .timer-card {
        padding: 2rem;
        border-radius: 1.5rem;
        max-width: 32rem;
      }
    }

    .timer-card:hover {
      transform: scale(1.02);
    }

    .timer-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.2s ease;
    }

    .timer-box:hover {
      transform: scale(1.1);
    }

    .timer-value {
      font-size: 1.5rem;
      font-weight: 900;
      background: linear-gradient(to bottom right, #ec4899, #a855f7);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      font-variant-numeric: tabular-nums;
      animation: scaleIn 0.3s ease-out;
    }

    @media (min-width: 768px) {
      .timer-value {
        font-size: 3rem;
      }
    }

    .timer-label {
      font-size: 0.625rem;
      color: #fb7185;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0.25rem;
    }

    @media (min-width: 768px) {
      .timer-label {
        font-size: 0.75rem;
      }
    }

    .timeline-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      opacity: 0;
      transition: opacity 0.6s ease, transform 0.6s ease;
    }

    @media (min-width: 768px) {
      .timeline-card {
        gap: 1.5rem;
      }
    }

    .timeline-card.left {
      flex-direction: column;
      transform: translateX(-100px);
    }

    .timeline-card.right {
      flex-direction: column;
      transform: translateX(100px);
    }

    @media (min-width: 768px) {
      .timeline-card.left {
        flex-direction: row;
      }
      .timeline-card.right {
        flex-direction: row-reverse;
      }
    }

    .timeline-card.visible {
      opacity: 1;
      transform: translateX(0);
    }

    .timeline-icon {
      width: 5rem;
      height: 5rem;
      border-radius: 1rem;
      background: linear-gradient(to bottom right, #f472b6, #a855f7);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }

    @media (min-width: 768px) {
      .timeline-icon {
        width: 6rem;
        height: 6rem;
        font-size: 3rem;
      }
    }

    .timeline-icon:hover {
      transform: scale(1.1) rotate(5deg);
    }

    .timeline-content {
      flex: 1;
      width: 100%;
      padding: 1rem;
      border-radius: 1rem;
      transition: transform 0.3s ease;
    }

    @media (min-width: 768px) {
      .timeline-content {
        padding: 1.5rem;
      }
    }

    .timeline-content:hover {
      transform: scale(1.02);
    }

    .gallery-card {
      aspect-ratio: 1;
      border-radius: 1rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      opacity: 0;
      transform: scale(0);
      transition: transform 0.3s ease, opacity 0.6s ease;
    }

    @media (min-width: 768px) {
      .gallery-card {
        padding: 1.5rem;
      }
    }

    .gallery-card.visible {
      animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .gallery-card:hover {
      transform: scale(1.05) rotate(5deg);
    }

    .letter-card {
      max-width: 42rem;
      width: 100%;
      padding: 1.5rem;
      border-radius: 1.5rem;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
      opacity: 0;
      transform: rotateY(-90deg);
      transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @media (min-width: 768px) {
      .letter-card {
        padding: 3rem;
      }
    }

    .letter-card.visible {
      opacity: 1;
      transform: rotateY(0);
    }

    .letter-line {
      opacity: 0;
      transform: translateY(20px);
    }

    .letter-card.visible .letter-line {
      animation: fadeInUp 0.8s ease-out forwards;
    }

    .letter-card.visible .letter-line:nth-child(1) { animation-delay: 0.2s; }
    .letter-card.visible .letter-line:nth-child(2) { animation-delay: 0.4s; }
    .letter-card.visible .letter-line:nth-child(3) { animation-delay: 0.6s; }
    .letter-card.visible .letter-line:nth-child(4) { animation-delay: 0.8s; }

    .final-visible {
      animation: scaleIn 1s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .final-heart {
      font-size: 4.5rem;
      animation: heartBeat 3s ease-in-out infinite;
    }

    @media (min-width: 768px) {
      .final-heart {
        font-size: 6rem;
      }
    }

    .particle {
      position: absolute;
      font-size: 1.5rem;
      animation: particleFloat linear infinite;
      will-change: transform, opacity;
    }

    .main-container {
      -webkit-overflow-scrolling: touch;
    }

    /* Optimize scrollbar for better performance */
    .main-container::-webkit-scrollbar {
      width: 8px;
    }

    .main-container::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
    }

    .main-container::-webkit-scrollbar-thumb {
      background: rgba(236, 72, 153, 0.3);
      border-radius: 4px;
    }

    .main-container::-webkit-scrollbar-thumb:hover {
      background: rgba(236, 72, 153, 0.5);
    }
  `;
  document.head.appendChild(style);
}
