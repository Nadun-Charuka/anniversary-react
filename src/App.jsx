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
// STATIC CONSTANTS & DATA (Hoisted for Performance)
// ============================================================================
const START_DATE = "2025-01-03";
const START_TIMESTAMP = new Date(START_DATE).getTime(); // Calculated once

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
// ANIMATION VARIANTS
// ============================================================================
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// ============================================================================
// MAIN APP
// ============================================================================
const App = () => {
  const [unlocked, setUnlocked] = useState(false);

  return (
    // Fixed: 'bg-linear' to 'bg-gradient' and added 'h-[100dvh]' for mobile
    <div className="h-[100dvh] bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 overflow-hidden">
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
// LOCK SCREEN
// ============================================================================
const LockScreen = memo(({ onUnlock }) => {
  const [hearts, setHearts] = useState([false, false, false, false]);

  // Optimization: Simple boolean check, no need for complex useMemo here
  const allActive = hearts.every(Boolean);

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.6 }}
      className="h-full flex flex-col items-center justify-center p-8 relative"
    >
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center space-y-8"
      >
        <motion.div variants={fadeInUp}>
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% auto" }}
          >
            Hey Nathasha ✨
          </motion.h1>
          <p className="text-rose-400 text-lg">Unlock your surprise...</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!allActive ? (
            <motion.div
              key="hearts"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-4"
            >
              <p className="text-rose-600 font-medium">
                Tap all the hearts to unlock 💝
              </p>
              <div className="flex gap-4 justify-center">
                {hearts.map((active, i) => (
                  <motion.button
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: i * 0.1,
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleHeart(i)}
                    disabled={active}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-4xl transition-all duration-300 ${
                      active
                        ? "bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-300"
                        : "bg-white/50 backdrop-blur-sm border-2 border-rose-200"
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
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
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
// MAIN EXPERIENCE
// ============================================================================
const MainExperience = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // FIX: Force scroll to top on mount to ensure animations trigger correctly
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // Use h-[100dvh] for mobile browser address bar handling
      className="h-[100dvh] overflow-y-auto overflow-x-hidden snap-y snap-mandatory relative"
      style={{
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
      }}
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
// HERO SECTION
// ============================================================================
const HeroSection = memo(({ scrollYProgress }) => {
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const smoothTextOpacity = useSpring(textOpacity, {
    stiffness: 100,
    damping: 20,
  });
  const smoothTextScale = useSpring(textScale, { stiffness: 100, damping: 20 });
  const smoothBgOpacity = useSpring(bgOpacity, { stiffness: 100, damping: 20 });

  return (
    <section className="min-h-screen snap-start flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <motion.div
        style={{ opacity: smoothBgOpacity }}
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 60%)",
            "radial-gradient(circle at 60% 40%, rgba(168, 85, 247, 0.15) 0%, transparent 60%)",
            "radial-gradient(circle at 40% 60%, rgba(236, 72, 153, 0.15) 0%, transparent 60%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        style={{ opacity: smoothTextOpacity, scale: smoothTextScale }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="text-center space-y-6 md:space-y-8 max-w-4xl relative z-10"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-5xl md:text-8xl font-black bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent leading-tight px-2"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% auto" }}
        >
          Nadun & Nathasha
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="text-xl md:text-2xl text-rose-400 font-light"
        >
          Forever & Always
        </motion.p>

        <TimerCard />

        <motion.p
          variants={fadeInUp}
          animate={{ y: [0, 10, 0] }}
          transition={{
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="text-rose-300 text-xs md:text-sm pt-4"
        >
          Scroll to explore our journey ↓
        </motion.p>
      </motion.div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

// ============================================================================
// TIMER CARD
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
        const now = Date.now();
        const diff = now - START_TIMESTAMP; // Uses hoisted constant

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
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.02 }}
      className="bg-white/20 backdrop-blur-xl p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/30 shadow-2xl max-w-[90%] md:max-w-lg mx-auto"
    >
      <p className="text-xs md:text-sm uppercase tracking-widest text-rose-400 mb-4 md:mb-6 font-semibold">
        Together for
      </p>
      <div className="grid grid-cols-4 gap-2 md:gap-4">
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
  <motion.div
    whileHover={{ scale: 1.1 }}
    className="flex flex-col items-center"
  >
    <motion.span
      key={val}
      initial={{ scale: 1.3, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      className="text-2xl md:text-5xl font-black text-transparent bg-gradient-to-br from-pink-500 to-purple-500 bg-clip-text tabular-nums"
    >
      {val}
    </motion.span>
    <span className="text-[10px] md:text-xs text-rose-400 uppercase tracking-wider mt-1">
      {label}
    </span>
  </motion.div>
));

TimerBox.displayName = "TimerBox";

// ============================================================================
// TIMELINE SECTION
// ============================================================================
const TimelineSection = memo(() => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8 py-20"
    >
      <div className="max-w-4xl w-full space-y-8 md:space-y-12">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-8 md:mb-16"
        >
          Our Journey ✨
        </motion.h3>
        {MEMORIES.map((memory, index) => (
          <TimelineCard key={memory.title} memory={memory} index={index} />
        ))}
      </div>
    </section>
  );
});

TimelineSection.displayName = "TimelineSection";

const TimelineCard = memo(({ memory, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={isEven ? slideInLeft : slideInRight}
      transition={{ delay: index * 0.1 }}
      className={`flex items-center gap-4 md:gap-6 ${
        isEven ? "flex-col md:flex-row" : "flex-col md:flex-row-reverse"
      }`}
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-4xl md:text-5xl shadow-xl shrink-0"
      >
        {memory.icon}
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        className="flex-1 w-full bg-white/30 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-white/30 shadow-lg"
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
      </motion.div>
    </motion.div>
  );
});

TimelineCard.displayName = "TimelineCard";

// ============================================================================
// GALLERY SECTION
// ============================================================================
const GallerySection = memo(() => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8 py-20"
    >
      <div className="max-w-5xl w-full">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-8 md:mb-16"
        >
          Our Memories 💕
        </motion.h3>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {PHOTOS.map((photo, index) => (
            <GalleryCard key={photo.caption} photo={photo} index={index} />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-500 mt-8 italic text-sm"
        >
          Replace these with your actual photos! 📷
        </motion.p>
      </div>
    </section>
  );
});

GallerySection.displayName = "GallerySection";

const GalleryCard = memo(({ photo, index }) => {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.05, rotate: 5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ delay: index * 0.1 }}
      className={`aspect-square rounded-2xl bg-gradient-to-br ${photo.color} p-4 md:p-6 flex flex-col items-center justify-center text-center shadow-xl cursor-pointer`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-4xl md:text-6xl mb-2 md:mb-4"
      >
        {photo.emoji}
      </motion.div>
      <p className="text-white font-semibold text-xs md:text-base drop-shadow-lg">
        {photo.caption}
      </p>
    </motion.div>
  );
});

GalleryCard.displayName = "GalleryCard";

// ============================================================================
// LETTER SECTION
// ============================================================================
const LetterSection = memo(() => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8"
    >
      <motion.div
        initial={{ opacity: 0, rotateY: -90 }}
        animate={isInView ? { opacity: 1, rotateY: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="max-w-2xl w-full bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl p-6 md:p-12 rounded-3xl border border-white/30 shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="text-5xl md:text-6xl text-center mb-6 md:mb-8"
        >
          💌
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-4 md:space-y-6 text-gray-700 leading-relaxed text-sm md:text-base"
        >
          <motion.p variants={fadeInUp}>Dear Nathasha,</motion.p>
          <motion.p variants={fadeInUp}>
            One year ago, you walked into my life and everything changed. Every
            moment with you feels like magic, and I still can't believe how
            lucky I am to call you mine.
          </motion.p>
          <motion.p variants={fadeInUp}>
            Thank you for all the laughter, adventures, and endless love. Here's
            to many more years of creating beautiful memories together.
          </motion.p>
          <motion.p
            variants={fadeInUp}
            className="text-right font-semibold text-rose-600"
          >
            Forever yours,
            <br />
            Nadun ❤️
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
});

LetterSection.displayName = "LetterSection";

// ============================================================================
// FINAL SECTION
// ============================================================================
const FinalSection = memo(() => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section
      ref={ref}
      className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="text-center space-y-6 md:space-y-8"
      >
        <motion.div
          animate={isInView ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-7xl md:text-9xl"
        >
          💖
        </motion.div>
        <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent px-4">
          Happy 1st Anniversary!
        </h2>
        <motion.p
          animate={isInView ? { opacity: [0.7, 1, 0.7] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-xl md:text-2xl text-rose-400"
        >
          To many more adventures together 🌹
        </motion.p>
      </motion.div>
    </section>
  );
});

FinalSection.displayName = "FinalSection";

export default App;
