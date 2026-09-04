import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

// 스크롤 시 아래에서 위로 떠오르며 나타나는 공용 모션 래퍼 (2026-09-01)
export function Reveal({
  children,
  className,
  style,
  delay = 0,
  y = 40,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
