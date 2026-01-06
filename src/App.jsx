import { useState, useEffect, useRef, memo } from "react";
import "./animations.css";

const START_DATE = "2025-01-03";

const App = () => {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-rose-50 to-purple-50 overflow-hidden text-slate-800">
      {!unlocked ? (
        <LockScreen onUnlock={() => setUnlocked(true)} />
      ) : (
        <MainExperience />
      )}
    </div>
  );
};

// ============================================================================
// LOCK SCREEN
// ============================================================================
const LockScreen = memo(({ onUnlock }) => {
  const [hearts, setHearts] = useState([false, false, false, false]);
  const allActive = hearts.every((h) => h);

  useEffect(() => {
    if (allActive) {
      const timer = setTimeout(onUnlock, 1500);
      return () => clearTimeout(timer);
    }
  }, [allActive, onUnlock]);

  const toggleHeart = (index) => {
    setHearts((prev) => {
      const newHearts = [...prev];
      newHearts[index] = true;
      return newHearts;
    });
  };

  return (
    <div className="lock-screen">
      <div className="animated-background" />

      <div className="lock-content">
        <div className="lock-header">
          <h1 className="text-5xl md:text-7xl font-bold gradient-text-shimmer mb-4">
            Hey Nathasha ✨
          </h1>
          <p className="text-rose-400 text-lg">Unlock your surprise...</p>
        </div>

        {!allActive ? (
          <div className="space-y-4 fade-in-delayed">
            <p className="text-rose-600 font-medium">
              Tap all the hearts to unlock 💝
            </p>
            <div className="flex gap-4 justify-center">
              {hearts.map((active, i) => (
                <button
                  key={i}
                  onClick={() => toggleHeart(i)}
                  className={`heart-button ${active ? "active" : ""}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                  disabled={active}
                >
                  {active ? "❤️" : "🤍"}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-3xl font-bold text-rose-500 scale-bounce">
            Opening... 💕
          </div>
        )}
      </div>
    </div>
  );
});

LockScreen.displayName = "LockScreen";

// ============================================================================
// MAIN EXPERIENCE
// ============================================================================
const MainExperience = () => {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth"
      style={{
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
      }}
    >
      <HeroSection />
      <TimelineSection />
      <GallerySection />
      <LetterSection />
      <FinalSection />
    </div>
  );
};

// ============================================================================
// HERO SECTION - Pure CSS Timer
// ============================================================================
const HeroSection = memo(() => {
  return (
    <section className="min-h-screen snap-start flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden hero-section">
      <div className="text-center space-y-6 md:space-y-8 w-full max-w-4xl px-4">
        <h2 className="text-5xl md:text-8xl font-black gradient-text-wave leading-tight">
          Nadun & Nathasha
        </h2>

        <p className="text-xl md:text-2xl text-rose-400 font-light pulse-subtle">
          Forever & Always
        </p>

        <TimerCard />

        <p className="text-rose-300 text-xs md:text-sm pt-4 bounce-slow">
          Scroll to explore our journey ↓
        </p>
      </div>

      <div className="hero-glow" />
    </section>
  );
});

HeroSection.displayName = "HeroSection";

// ============================================================================
// TIMER CARD - Optimized with RAF
// ============================================================================
const TimerCard = memo(() => {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const rafRef = useRef(null);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();

      // Only update once per second
      if (now - lastUpdateRef.current >= 1000) {
        const start = new Date(START_DATE).getTime();
        const diff = now - start;

        setTime({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });

        lastUpdateRef.current = now;
      }

      rafRef.current = requestAnimationFrame(updateTime);
    };

    rafRef.current = requestAnimationFrame(updateTime);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="timer-container glass-card">
      <p className="text-xs md:text-sm uppercase tracking-widest text-rose-400 mb-4 md:mb-6 font-semibold">
        Together for
      </p>
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        <TimerBox val={time.days} label="Days" />
        <TimerBox val={time.hours} label="Hours" />
        <TimerBox val={time.minutes} label="Mins" />
        <TimerBox val={time.seconds} label="Secs" />
      </div>
    </div>
  );
});

TimerCard.displayName = "TimerCard";

const TimerBox = memo(({ val, label }) => (
  <div className="timer-box">
    <span className="timer-value" key={val}>
      {val}
    </span>
    <span className="timer-label">{label}</span>
  </div>
));

TimerBox.displayName = "TimerBox";

// ============================================================================
// TIMELINE SECTION
// ============================================================================
const TimelineSection = memo(() => {
  return (
    <section className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8 py-20">
      <div className="max-w-4xl w-full space-y-8 md:space-y-12">
        <h3 className="text-4xl md:text-5xl font-bold text-center gradient-text-shimmer mb-8 md:mb-16">
          Our Journey ✨
        </h3>

        {memories.map((memory, index) => (
          <TimelineCard key={memory.title} memory={memory} index={index} />
        ))}
      </div>
    </section>
  );
});

TimelineSection.displayName = "TimelineSection";

const TimelineCard = memo(({ memory, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const isEven = index % 2 === 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing after visible
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`timeline-card ${isVisible ? "visible" : ""} ${
        isEven ? "timeline-left" : "timeline-right"
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="timeline-icon gradient-bg-animated">{memory.icon}</div>

      <div className="timeline-content glass-card">
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
  );
});

TimelineCard.displayName = "TimelineCard";

// ============================================================================
// GALLERY SECTION
// ============================================================================
const GallerySection = memo(() => {
  const photos = [
    { emoji: "📸", caption: "Our First Selfie", gradient: "gradient-pink" },
    { emoji: "🌅", caption: "Sunset Together", gradient: "gradient-orange" },
    { emoji: "🎭", caption: "Movie Night", gradient: "gradient-purple" },
    { emoji: "🍝", caption: "Dinner Date", gradient: "gradient-red" },
  ];

  return (
    <section className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8 py-20">
      <div className="max-w-5xl w-full">
        <h3 className="text-4xl md:text-5xl font-bold text-center gradient-text-shimmer mb-8 md:mb-16">
          Our Memories 💕
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {photos.map((photo, index) => (
            <GalleryCard key={photo.caption} photo={photo} index={index} />
          ))}
        </div>

        <p className="text-center text-gray-500 mt-8 italic text-sm fade-in">
          Replace these with your actual photos! 📷
        </p>
      </div>
    </section>
  );
});

GallerySection.displayName = "GallerySection";

const GalleryCard = memo(({ photo, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`gallery-card ${photo.gradient} ${isVisible ? "visible" : ""}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="text-4xl md:text-6xl mb-2 md:mb-4 float-gentle">
        {photo.emoji}
      </div>
      <p className="text-white font-semibold text-xs md:text-base drop-shadow-lg">
        {photo.caption}
      </p>
    </div>
  );
});

GalleryCard.displayName = "GalleryCard";

// ============================================================================
// LETTER SECTION
// ============================================================================
const LetterSection = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
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
        className={`letter-card glass-card ${isVisible ? "visible" : ""}`}
      >
        <div className="text-5xl md:text-6xl text-center mb-6 md:mb-8 scale-bounce">
          💌
        </div>

        <div className="space-y-4 md:space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
          <p className="letter-line">Dear Nathasha,</p>

          <p className="letter-line">
            One year ago, you walked into my life and everything changed. Every
            moment with you feels like magic, and I still can't believe how
            lucky I am to call you mine.
          </p>

          <p className="letter-line">
            Thank you for all the laughter, adventures, and endless love. Here's
            to many more years of creating beautiful memories together.
          </p>

          <p className="letter-line text-right font-semibold text-rose-600">
            Forever yours,
            <br />
            Nadun ❤️
          </p>
        </div>
      </div>
    </section>
  );
});

LetterSection.displayName = "LetterSection";

// ============================================================================
// FINAL SECTION
// ============================================================================
const FinalSection = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
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
          isVisible ? "final-content" : ""
        }`}
      >
        <div className="final-heart">💖</div>

        <h2 className="text-4xl md:text-6xl font-black gradient-text-wave px-4">
          Happy 1st Anniversary!
        </h2>

        <p className="text-xl md:text-2xl text-rose-400 pulse-subtle">
          To many more adventures together 🌹
        </p>
      </div>
    </section>
  );
});

FinalSection.displayName = "FinalSection";

// ============================================================================
// DATA
// ============================================================================
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
