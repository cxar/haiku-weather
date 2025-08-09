import { motion } from "framer-motion";

export default function TitleFade({ isContentLoaded }: { isContentLoaded: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: isContentLoaded ? 0 : 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="inline-block parchment px-8 md:px-14 py-8 md:py-10">
        <h1 className="parchment-title text-4xl md:text-5xl text-[#3b2a1e] select-none text-center">
          Haiku Weather
        </h1>
      </div>
    </motion.div>
  );
}