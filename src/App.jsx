import { useState, useEffect, useRef, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";

// ============================================================================
// 1. STATIC DATA (Hoisted for Performance)
// ============================================================================
const START_DATE = "2024-01-03"; // Set your actual start date here
const START_TIMESTAMP = new Date(START_DATE).getTime();

const MEMORIES = [
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

const PHOTOS = [
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
  { emoji: "🎭", caption: "Movie Night", color: "from-purple-400 to-pink-500" },
  { emoji: "🍝", caption: "Dinner Date", color: "from-red-400 to-rose-500" },
];

// ============================================================================
// 2. "CALM" ANIMATION VARIANTS (Slower, smoother)
// ============================================================================
const transitionSettings = { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }; // Soft Cubic Bezier

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionSettings,
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionSettings,
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

// ============================================================================
// 3. MAIN APP COMPONENT
// ============================================================================
const App = () => {
  const [unlocked, setUnlocked] = useState(false);

  return (
    // h-[100dvh] fixes mobile browser address bar jumps
    <div className="h-dvh bg-linear-to-br from-pink-50 via-rose-50 to-purple-50 overflow-hidden text-gray-800 font-sans">
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <LockScreen key="lock" onUnlock={() => setUnlocked(true)} />
        ) : (
          <MainExperience key="main" />
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// 4. OPTIMIZED LOCK SCREEN
// ============================================================================
const LockScreen = memo(({ onUnlock }) => {
  const [hearts, setHearts] = useState([false, false, false, false]);
  const allActive = hearts.every(Boolean);

  useEffect(() => {
    if (allActive) {
      const timer = setTimeout(onUnlock, 1200);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }} // Dramatic exit
      transition={{ duration: 0.8 }}
      className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden"
    >
      {/* CSS-based Background Animation (GPU Efficient) */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin_15s_linear_infinite] bg-[conic-gradient(from_0deg,#fbcfe8,#d8b4fe,#fbcfe8)] blur-3xl opacity-50"></div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center space-y-8"
      >
        <motion.div variants={fadeInUp}>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-linear-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
            Hey Nathasha ✨
          </h1>
          <p className="text-rose-400 text-lg font-medium tracking-wide">
            Unlock your surprise...
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!allActive ? (
            <motion.div
              key="hearts"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-6"
            >
              <p className="text-rose-600/80 font-medium text-sm uppercase tracking-widest">
                Tap the hearts 💝
              </p>
              <div className="flex gap-4 justify-center">
                {hearts.map((active, i) => (
                  <motion.button
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: i * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleHeart(i)}
                    disabled={active}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-all duration-500 ${
                      active
                        ? "bg-linear-to-br from-pink-400 to-rose-500 text-white shadow-pink-300/50 scale-110"
                        : "bg-white/80 text-rose-300 border-2 border-rose-100 hover:border-rose-300"
                    }`}
                  >
                    {active ? "❤️" : "🤍"}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="opening"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold text-rose-500"
            >
              Opening... 💕
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

LockScreen.displayName = "LockScreen";

// ============================================================================
// 5. MAIN EXPERIENCE CONTAINER
// ============================================================================
const MainExperience = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Force scroll reset on mount
  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="h-dvh overflow-y-auto overflow-x-hidden snap-y snap-mandatory relative scroll-smooth"
    >
      <HeroSection scrollYProgress={scrollYProgress} />
      <TimelineSection />
      <GallerySection />
      <LetterSection />
      <FinalSection />
    </motion.div>
  );
};

// ============================================================================
// 6. HERO SECTION (Lag-Free Version)
// ============================================================================
const HeroSection = memo(({ scrollYProgress }) => {
  // Only animate opacity/scale on scroll, NOT background
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  const smoothOpacity = useSpring(textOpacity, { stiffness: 100, damping: 20 });
  const smoothScale = useSpring(textScale, { stiffness: 100, damping: 20 });

  return (
    <section className="min-h-screen snap-start flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Optimized Background: CSS Animation instead of Framer Motion */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-linear-to-r from-pink-200/40 to-purple-200/40 rounded-full blur-3xl opacity-60 animate-pulse"></div>
      </div>

      <motion.div
        style={{ opacity: smoothOpacity, scale: smoothScale }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="text-center space-y-8 max-w-4xl relative z-10"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-br from-pink-500 via-rose-500 to-purple-600 leading-tight px-2 drop-shadow-sm"
        >
          Nadun & Nathasha
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="text-xl md:text-2xl text-rose-400 font-light tracking-wide"
        >
          Forever & Always
        </motion.p>

        <TimerCard />

        <motion.p
          variants={fadeInUp}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-rose-300 text-xs md:text-sm font-medium tracking-widest pt-8 uppercase"
        >
          Scroll to explore ↓
        </motion.p>
      </motion.div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

// ============================================================================
// 7. TIMER CARD (Optimized for Mobile)
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
    const updateTime = (timestamp) => {
      if (timestamp - lastUpdateRef.current >= 1000) {
        const diff = Date.now() - START_TIMESTAMP;
        setTime({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
        lastUpdateRef.current = timestamp;
      }
      rafRef.current = requestAnimationFrame(updateTime);
    };
    rafRef.current = requestAnimationFrame(updateTime);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.02 }}
      // FIX: Mobile gets solid background (Fast), Desktop gets Blur (Pretty)
      className="bg-white/90 backdrop-blur-none md:bg-white/30 md:backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/50 shadow-xl shadow-pink-100/50 max-w-[90%] md:max-w-lg mx-auto will-change-transform"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-6">
        Together for
      </p>
      <div className="grid grid-cols-4 gap-2 md:gap-4 divide-x divide-rose-100">
        <TimerBox val={time.days} label="Days" />
        <TimerBox val={time.hours} label="Hours" />
        <TimerBox val={time.minutes} label="Mins" />
        <TimerBox val={time.seconds} label="Secs" />
      </div>
    </motion.div>
  );
});

TimerCard.displayName = "TimerCard";

const TimerBox = memo(({ val, label }) => (
  <div className="flex flex-col items-center px-1">
    <span className="text-2xl md:text-4xl font-black text-gray-800 tabular-nums">
      {val}
    </span>
    <span className="text-[10px] md:text-xs text-rose-400 font-bold uppercase mt-1">
      {label}
    </span>
  </div>
));

TimerBox.displayName = "TimerBox";

// ============================================================================
// 8. SECTIONS (Using 'whileInView' with 'once: true' for performance)
// ============================================================================

const TimelineSection = memo(() => (
  <section className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8 py-20">
    <div className="max-w-4xl w-full space-y-12">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} // Only animates once! (Saves RAM)
        transition={transitionSettings}
        className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12"
      >
        Our Journey ✨
      </motion.h3>
      <div className="space-y-8">
        {MEMORIES.map((memory, index) => (
          <TimelineCard key={memory.title} memory={memory} index={index} />
        ))}
      </div>
    </div>
  </section>
));
TimelineSection.displayName = "TimelineSection";

const TimelineCard = memo(({ memory, index }) => {
  const isEven = index % 2 === 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`flex items-center gap-4 md:gap-8 ${
        isEven ? "flex-col md:flex-row" : "flex-col md:flex-row-reverse"
      }`}
    >
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl shrink-0 border-4 border-pink-50">
        {memory.icon}
      </div>
      <div className="flex-1 w-full bg-white/80 md:bg-white/40 border border-white/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-xl font-bold text-gray-800 mb-1">{memory.title}</h4>
        <p className="text-rose-500 text-sm font-semibold mb-2">
          {memory.date}
        </p>
        <p className="text-gray-600 leading-relaxed">{memory.description}</p>
      </div>
    </motion.div>
  );
});
TimelineCard.displayName = "TimelineCard";

const GallerySection = memo(() => (
  <section className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8 py-20">
    <div className="max-w-5xl w-full">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={transitionSettings}
        className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16"
      >
        Our Memories 💕
      </motion.h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PHOTOS.map((photo, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, ...transitionSettings }}
            whileHover={{ scale: 1.03, rotate: 2 }}
            className={`aspect-square rounded-3xl bg-linear-to-br ${photo.color} p-4 flex flex-col items-center justify-center text-center shadow-lg text-white`}
          >
            <div className="text-5xl mb-3 drop-shadow-md">{photo.emoji}</div>
            <p className="font-bold text-sm md:text-base shadow-black/10 drop-shadow-sm">
              {photo.caption}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
));
GallerySection.displayName = "GallerySection";

const LetterSection = memo(() => (
  <section className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={transitionSettings}
      className="max-w-2xl w-full bg-white/90 md:bg-white/40 md:backdrop-blur-xl p-8 md:p-16 rounded-4xl border border-white shadow-2xl relative"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl shadow-xl rounded-full bg-white p-4">
        💌
      </div>
      <div className="space-y-6 text-gray-700 leading-loose text-lg font-light mt-6">
        <p>Dear Nathasha,</p>
        <p>
          One year ago, you walked into my life and everything changed. Every
          moment with you feels like magic, and I still can't believe how lucky
          I am to call you mine.
        </p>
        <p>
          Thank you for all the laughter, adventures, and endless love. Here's
          to many more years of creating beautiful memories together.
        </p>
        <p className="text-right font-bold text-rose-500 pt-4 text-xl font-serif">
          Forever yours,
          <br />
          Nadun ❤️
        </p>
      </div>
    </motion.div>
  </section>
));
LetterSection.displayName = "LetterSection";

const FinalSection = memo(() => (
  <section className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8 text-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={transitionSettings}
      className="space-y-8"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-8xl md:text-9xl filter drop-shadow-2xl"
      >
        💖
      </motion.div>
      <h2 className="text-4xl md:text-6xl font-black bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent px-4">
        Happy 1st Anniversary!
      </h2>
      <p className="text-xl md:text-2xl text-rose-400 font-medium">
        To many more adventures together 🌹
      </p>
    </motion.div>
  </section>
));
FinalSection.displayName = "FinalSection";

export default App;
