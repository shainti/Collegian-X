import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export default function ScrollRevealText() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "start 35%"],
  });

  const rawY       = useTransform(scrollYProgress, [0, 1],    [40, 0]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  const y = useSpring(rawY, {
    stiffness: 120,
    damping:    26,
    mass:      0.6,
  });

  const opacity = useSpring(rawOpacity, {
    stiffness: 140,
    damping:    30,
    mass:      0.6,
  });

  return (
    <section
      ref={ref}
      className="relative w-full min-h-[55vh] flex items-center justify-center overflow-hidden bg-[#050B16]"
    >
      {/* Dark fade TOP — blends with hero bottom */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-40 z-20"
        style={{ background: "linear-gradient(to bottom, #020810 0%, transparent 100%)" }}
      />

      {/* Dark fade BOTTOM — blends into footer top */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 z-20"
        style={{ background: "linear-gradient(to top, #020810 0%, transparent 100%)" }}
      />

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center space-y-6 will-change-transform px-6"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Let's Study Together
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
          Collegian X · Work With Us · For Students · Our Services
        </div>
      </motion.div>
    </section>
  );
}