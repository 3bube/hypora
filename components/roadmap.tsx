"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const roadmapItems = [
  {
    quarter: "Q1 2024",
    title: "Private Beta Launch",
    description:
      "Limited access to early supporters with core wallet functionality.",
  },
  {
    quarter: "Q2 2024",
    title: "Public Beta",
    description:
      "Open access with multi-chain support and enhanced security features.",
  },
  {
    quarter: "Q3 2024",
    title: "Mobile App Release",
    description: "iOS and Android apps with biometric authentication.",
  },
  {
    quarter: "Q4 2024",
    title: "Enterprise Solutions",
    description: "Institutional-grade features and API access for developers.",
  },
];

export default function Roadmap() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <div ref={ref} className="relative mx-auto max-w-4xl">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-green-500/80 to-green-500/0 md:left-1/2 md:-ml-0.5"></div>

      <div className="space-y-12">
        {roadmapItems.map((item, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: index * 0.3,
                  duration: 0.6,
                },
              },
            }}
            className={`relative flex flex-col md:flex-row ${
              index % 2 === 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Dot on timeline */}
            <div className="absolute left-4 top-6 h-4 w-4 -translate-x-1/2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(16,185,129,0.7)] md:left-1/2"></div>

            {/* Content */}
            <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
              <div className="rounded-xl border border-green-500/20 bg-black/40 p-6 backdrop-blur-md">
                <div className="mb-2 inline-block rounded-md bg-green-900/30 px-2 py-1 text-xs font-medium text-green-400">
                  {item.quarter}
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
