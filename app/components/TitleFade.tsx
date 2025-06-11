import { motion } from "framer-motion";

export default function TitleFade({ isContentLoaded }: { isContentLoaded: boolean }) {
  return (
    <motion.h1
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl md:text-4xl text-gray-900 drop-shadow-md pointer-events-none select-none z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: isContentLoaded ? 0 : 1 }}
      transition={{ duration: 0.6 }}
    >
      Haiku Weather
    </motion.h1>
  );
} 