"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // 1. 기준점은 상단 중앙으로 유지
      position="top-center"
      // 2. 화면 위에서부터 45vh(화면 높이의 45%)만큼 밀어내서 중앙에 배치
      offset="45vh" 
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          // 기존에 있던 position, top, left, transform 강제 할당 코드는 삭제합니다.
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };