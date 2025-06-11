import { motion } from "framer-motion";

export default function TitleFade({ isContentLoaded }: { isContentLoaded: boolean }) {
  return (
    <motion.h1
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-5xl font-serif text-gray-900 pointer-events-none select-none z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: isContentLoaded ? 0 : 1 }}
      transition={{ duration: 0.6 }}
    >
      Haiku Weather
    </motion.h1>
  );
} 