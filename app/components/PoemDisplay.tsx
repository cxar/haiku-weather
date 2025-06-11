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
      className="text-center font-serif z-30 select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1}}
    >
      <div
        className="inline-block backdrop-blur-lg bg-white/50 rounded-[3rem] px-8 md:px-12 py-6 md:py-8 shadow-lg ring-1 ring-white/20"
      >
        <p className="whitespace-pre-line text-2xl md:text-4xl leading-relaxed tracking-wide max-w-screen-md mx-auto select-none">
          {poem.split('\n').map((line, i) => (
            <motion.span
              key={i}
              className="block text-gray-900 select-none"
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
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-gray-200/60 hover:bg-gray-300 px-3 py-1 text-sm text-gray-700 shadow transition select-auto"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </motion.div>
  );
}
