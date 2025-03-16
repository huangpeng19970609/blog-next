// src/components/ScrollProgressBar.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import styles from "@/pages/_app.module.scss";

export default function ScrollProgressBar({ progress }: { progress: number }) {
  return (
    <motion.div
      className={styles["scroll-progress"]}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        transformOrigin: "0%",
      }}
      animate={{ scaleX: progress / 100 }}
    />
  );
}
