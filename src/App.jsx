import { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";

const START_DATE = "2025-01-03"; // Change to your actual date

const App = () => {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-rose-50 to-purple-50 overflow-hidden text-slate-800">
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <LockScreen key="lock" onUnlock={() => setUnlocked(true)} />
        ) : (
          <MainExperience key="main" />
        )}
      </AnimatePresence>

      <FloatingParticles />
    </div>
  );
};

// 🔒 LOCK SCREEN with Puzzle
const LockScreen = ({ onUnlock }) => {
  const [hearts, setHearts] = useState([false, false, false, false]);

  // Calculate if all hearts are active
  const allHeartsActive = hearts.every((h) => h);

  // Use effect only for the unlock timeout
  useEffect(() => {
    if (allHeartsActive) {
      const timer = setTimeout(() => onUnlock(), 2000);
      return () => clearTimeout(timer);
    }
  }, [allHeartsActive, onUnlock]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
      className="min-h-dvh flex flex-col items-center justify-center p-8 relative z-20"
    >
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0"
      />

      <div className="relative z-10 text-center space-y-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent mb-4">
            Hey Nathasha ✨
          </h1>
          <p className="text-rose-400 text-lg">Unlock your surprise...</p>
        </motion.div>

        {!allHeartsActive ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <p className="text-rose-600 font-medium">
              Tap all the hearts to unlock 💝
            </p>
            <div className="flex gap-4 justify-center">
              {hearts.map((active, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() =>
                    setHearts((prev) => {
                      const newHearts = [...prev];
                      newHearts[i] = true;
                      return newHearts;
                    })
                  }
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-4xl transition-all duration-300 ${
                    active
                      ? "bg-linear-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-300"
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
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-rose-500"
          >
            Opening... 💕
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// 🎨 MAIN EXPERIENCE
const MainExperience = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const start = new Date(START_DATE);
      const now = new Date();
      const difference = now - start;

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-dvh w-full overflow-y-scroll overflow-x-hidden snap-y snap-mandatory relative z-10 scroll-smooth"
      style={{
        // CRITICAL FIX: Prevent elastic scrolling on iOS
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
      }}
    >
      <HeroSection timeLeft={timeLeft} scrollYProgress={scrollYProgress} />
      <TimelineSection />
      <GallerySection />
      <LetterSection />
      <FinalSection />
    </div>
  );
};

const HeroSection = ({ timeLeft, scrollYProgress }) => {
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <motion.section
      style={{ opacity, scale }}
      className="min-h-dvh w-full snap-start flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-6 md:space-y-8 max-w-full"
      >
        <motion.h2
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="text-5xl md:text-8xl font-black bg-linear-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent bg-size-[200%_auto] leading-tight px-2"
        >
          Nadun & Nathasha
        </motion.h2>

        <p className="text-xl md:text-2xl text-rose-400 font-light">
          Forever & Always
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/20 backdrop-blur-xl p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/30 shadow-2xl max-w-[90%] md:max-w-lg mx-auto"
        >
          <p className="text-xs md:text-sm uppercase tracking-widest text-rose-400 mb-4 md:mb-6 font-semibold">
            Together for
          </p>
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            <TimerBox val={timeLeft.days} label="Days" />
            <TimerBox val={timeLeft.hours} label="Hours" />
            <TimerBox val={timeLeft.minutes} label="Mins" />
            <TimerBox val={timeLeft.seconds} label="Secs" />
          </div>
        </motion.div>

        <motion.p
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-rose-300 text-xs md:text-sm pt-4"
        >
          Scroll to explore our journey ↓
        </motion.p>
      </motion.div>
    </motion.section>
  );
};

const TimerBox = ({ val, label }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    className="flex flex-col items-center"
  >
    <motion.span
      key={val}
      initial={{ scale: 1.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-2xl md:text-5xl font-black text-transparent bg-linear-to-br from-pink-500 to-purple-500 bg-clip-text tabular-nums"
    >
      {val}
    </motion.span>
    <span className="text-[10px] md:text-xs text-rose-400 uppercase tracking-wider mt-1">
      {label}
    </span>
  </motion.div>
);

const TimelineSection = () => {
  return (
    <section className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8 py-20">
      <div className="max-w-4xl w-full space-y-8 md:space-y-12">
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl md:text-5xl font-bold text-center bg-linear-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-8 md:mb-16"
        >
          Our Journey ✨
        </motion.h3>

        {memories.map((memory, index) => (
          <TimelineCard key={index} memory={memory} index={index} />
        ))}
      </div>
    </section>
  );
};

const TimelineCard = ({ memory, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`flex items-center gap-4 md:gap-6 ${
        isEven ? "flex-col md:flex-row" : "flex-col md:flex-row-reverse"
      }`}
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-linear-to-br from-pink-400 to-purple-500 flex items-center justify-center text-4xl md:text-5xl shadow-xl shrink-0"
      >
        {memory.icon}
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
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
};

const GallerySection = () => {
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

  return (
    <section className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8 py-20">
      <div className="max-w-5xl w-full">
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl md:text-5xl font-bold text-center bg-linear-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-8 md:mb-16"
        >
          Our Memories 💕
        </motion.h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`aspect-square rounded-2xl bg-linear-to-br ${photo.color} p-4 md:p-6 flex flex-col items-center justify-center text-center shadow-xl cursor-pointer`}
            >
              <div className="text-4xl md:text-6xl mb-2 md:mb-4">
                {photo.emoji}
              </div>
              <p className="text-white font-semibold text-xs md:text-base">
                {photo.caption}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center text-gray-500 mt-8 italic text-sm"
        >
          Replace these with your actual photos! 📷
        </motion.p>
      </div>
    </section>
  );
};

const LetterSection = () => {
  return (
    <section className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, rotateY: -90 }}
        whileInView={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="max-w-2xl w-full bg-linear-to-br from-white/40 to-white/20 backdrop-blur-xl p-6 md:p-12 rounded-3xl border border-white/30 shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          className="text-5xl md:text-6xl text-center mb-6 md:mb-8"
        >
          💌
        </motion.div>

        <div className="space-y-4 md:space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Dear Nathasha,
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            One year ago, you walked into my life and everything changed. Every
            moment with you feels like magic, and I still can't believe how
            lucky I am to call you mine.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Thank you for all the laughter, adventures, and endless love. Here's
            to many more years of creating beautiful memories together.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-right font-semibold text-rose-600"
          >
            Forever yours,
            <br />
            Nadun ❤️
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};

const FinalSection = () => {
  return (
    <section className="min-h-screen snap-start flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center space-y-6 md:space-y-8"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-7xl md:text-9xl"
        >
          💖
        </motion.div>

        <h2 className="text-4xl md:text-6xl font-black bg-linear-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent px-4">
          Happy 1st Anniversary!
        </h2>

        <p className="text-xl md:text-2xl text-rose-400">
          To many more adventures together 🌹
        </p>
      </motion.div>
    </section>
  );
};

// CRITICAL FIX: Pre-generate ALL random values including emoji
const generateParticles = () => {
  const emojis = ["✨", "💕", "💖", "🌹", "💝"];
  return Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
    size: Math.random() * 20 + 10,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
  }));
};

const FloatingParticles = () => {
  // Generate particles ONCE with all values pre-calculated
  const particles = useMemo(() => generateParticles(), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "100vh", x: `${p.x}vw`, opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
          className="absolute"
          style={{ fontSize: `${p.size}px` }}
        >
          {p.emoji}
        </motion.div>
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
