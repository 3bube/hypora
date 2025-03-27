"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WaitlistFormProps {
  onSubmit: (email: string, username: string) => void;
}

export default function WaitlistForm({ onSubmit }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isUserNameValid, setIsUserNameValid] = useState(true);
  const [username, setUsername] = useState("@");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsEmailValid(false);
      return;
    }

    if (!username) {
      setIsUserNameValid(false);
      return;
    }

    try {
      setIsSubmitting(true);

      // Save to MongoDB via API route
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username }),
      });

      if (!response.ok) {
        // Safely parse JSON response or handle text response
        let errorMessage = "Failed to submit";
        
        // First try to parse as JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          // If not JSON, get as text
          const textContent = await response.text();
          if (textContent) errorMessage = textContent;
        }
        
        throw new Error(errorMessage);
      }

      // Call the original onSubmit prop for any additional handling
      onSubmit(email, username);

      // Reset form
      setEmail("");
      setUsername("");
      setIsEmailValid(true);
      setIsUserNameValid(true);
    } catch (error) {
      console.error("Error submitting to waitlist:", error);
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">Join the Waitlist</h3>
      <p className="text-gray-400">
        Be among the first to experience Hypora when we launch.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-2">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailValid(true);
              }}
              className={`h-12 border-green-500/30 bg-black/50 text-white placeholder:text-gray-500 focus:border-green-400 ${
                !isEmailValid ? "border-red-500" : ""
              }`}
            />
            {!isEmailValid && (
              <p className="mt-1 text-sm text-red-500">
                Please enter a valid email address
              </p>
            )}
          </div>

          <div>
            <Input
              type="text"
              placeholder="Enter your X username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setIsUserNameValid(true);
              }}
              className={`h-12 border-green-500/30 bg-black/50 text-white placeholder:text-gray-500 focus:border-green-400 ${
                !isUserNameValid ? "border-red-500" : ""
              }`}
            />
            {!isUserNameValid && (
              <p className="mt-1 text-sm text-red-500">
                Please enter a valid username
              </p>
            )}
          </div>
        </div>

        {submitError && <p className="text-sm text-red-500">{submitError}</p>}

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="h-12 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Join Waitlist"}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
