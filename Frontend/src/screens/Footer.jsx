import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export default function ScrollRevealText() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "start 35%"],
  });

  // Base transforms (small movement)
  const rawY = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  // ✅ LIGHT & SMOOTH spring (key fix)
  const y = useSpring(rawY, {
    stiffness: 120, // follows scroll faster
    damping: 26,   // removes jitter
    mass: 0.6,     // lighter → no lag
  });

  const opacity = useSpring(rawOpacity, {
    stiffness: 140,
    damping: 30,
    mass: 0.6,
  });

  return (
    <section
      ref={ref}
      className="relative w-full min-h-[65vh] flex justify-center mt-6"
    >
      <motion.div
        style={{ y, opacity }}
        className="text-center space-y-6 will-change-transform"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Let’s Study Together
        </h2>

        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
          One smart platform for students and faculty to collaborate,
          manage academics, and grow together.
        </p>

        <div
          className="
            text-2xl md:text-2xl font-semibold
            bg-[linear-gradient(to_right,#3b82f6,#14b8a6)]
            bg-clip-text text-transparent
          "
        >
         Collegian X  · Work With Us  · For Students  · Our Services
        </div>
      </motion.div>
    </section>
  );
}
