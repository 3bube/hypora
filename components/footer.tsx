"use client";

import { motion } from "framer-motion";
import { X, DiscIcon as Discord, Send } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { name: "X", icon: X, url: "https://x.com" },
    { name: "Discord", icon: Discord, url: "https://discord.gg" },
    { name: "Telegram", icon: Send, url: "https://t.me" },
  ];

  return (
    <footer className="border-t border-green-500/10 bg-black/60 py-12 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <h2 className="text-2xl font-bold text-white">
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Hypora
              </span>
            </h2>
            <p className="mt-2 text-gray-400">The future of Web3 wallets</p>
          </div>

          <div className="flex items-center space-x-6">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.1 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.2 + index * 0.1 },
                }}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-green-500/30 bg-black/50 text-green-400 transition-colors hover:border-green-400 hover:bg-green-500/10 hover:text-white hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              >
                <link.icon className="h-5 w-5" />
                <span className="sr-only">{link.name}</span>
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Hypora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
