"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";

export default function PoemDisplay({ poem }: { poem: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(poem);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <motion.div 
      className="text-center z-30 select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1}}
    >
      <div
        className="inline-block backdrop-blur-lg bg-white/50 dark:bg-black/40 rounded-[3rem] px-8 md:px-12 py-6 md:py-8 shadow-lg ring-1 ring-white/20 dark:ring-black/40"
      >
        <p className="whitespace-pre-line text-lg md:text-2xl leading-relaxed tracking-wide max-w-[80vw] md:max-w-screen-md mx-auto select-none">
          {poem.split('\n').slice(0,3).map((line, i) => (
            <motion.span
              key={i}
              className="block text-gray-900 dark:text-gray-100 select-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.35 }}
            >
              {line}
            </motion.span>
          ))}
        </p>

        <button
          onClick={handleCopy}
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-gray-200/60 hover:bg-gray-300 dark:bg-gray-700/60 dark:hover:bg-gray-600 px-3 py-1 text-sm text-gray-700 dark:text-gray-200 shadow transition select-auto"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </motion.div>
  );
}
