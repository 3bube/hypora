"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import MatrixBackground from "@/components/MatrixBackground";
import WaitlistForm from "@/components/WaitlistForm";
import Roadmap from "@/components/roadmap";
import Footer from "@/components/footer";

export default function HyporaWaitlist() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (email: string) => {
    // Here you would typically send the email to your backend
    console.log("Submitted email:", email);
    setIsSubmitted(true);

    // Reset after 5 seconds for demo purposes
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Matrix Background */}
      <div className="fixed inset-0 z-0 opacity-20">
        <MatrixBackground />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <main className="container mx-auto px-4 py-12 md:py-24">
          {/* Hero Section */}
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-6 inline-block rounded-full bg-green-900/30 px-4 py-1 text-sm font-medium text-green-400 backdrop-blur-sm">
                PRIVATE BETA
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                Join the Future of <br />
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Web3 Wallets
                </span>
              </h1>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mb-8 max-w-2xl text-xl text-gray-400 md:text-2xl"
              >
                Hypora is coming to revolutionize how you interact with the
                blockchain. Secure. Intuitive. Powerful.
              </motion.h2>

              {/* Waitlist Form */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="w-full max-w-md"
              >
                <div className="rounded-xl border border-green-500/20 bg-black/40 p-6 backdrop-blur-xl">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center space-y-4 text-center"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                        <Send className="h-8 w-8 text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        You&apos;re on the list!
                      </h3>
                      <p className="text-gray-400">
                        We&apos;ll notify you when Hypora is ready for early
                        access.
                      </p>
                    </motion.div>
                  ) : (
                    <WaitlistForm onSubmit={handleSubmit} />
                  )}
                </div>
              </motion.div>
            </motion.div>
          </section>

          {/* Features Glimpse */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-20"
          >
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Seamless Integration",
                  description:
                    "Connect to any dApp with a single click. No more complicated wallet connections.",
                  icon: "🔗",
                },
                {
                  title: "Military-grade Security",
                  description:
                    "Your keys, your crypto. Advanced encryption keeps your assets safe.",
                  icon: "🔒",
                },
                {
                  title: "Cross-chain Support",
                  description:
                    "Manage assets across multiple blockchains from one intuitive interface.",
                  icon: "⚡",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.2, duration: 0.5 }}
                  className="rounded-xl border border-green-500/10 bg-black/30 p-6 backdrop-blur-md"
                >
                  <div className="mb-4 text-3xl">{feature.icon}</div>
                  <h3 className="mb-2 text-xl font-bold text-green-400">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Roadmap Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mb-20"
          >
            <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Roadmap
              </span>
            </h2>
            <Roadmap />
          </motion.section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
