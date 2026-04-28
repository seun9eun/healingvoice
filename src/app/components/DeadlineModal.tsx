import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

interface DeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeadlineModal = ({ isOpen, onClose }: DeadlineModalProps) => {
  const { lang } = useLanguage();

  // 모달이 열려있을 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 이미지 경로 생성 함수
  const getImagePath = (type: "modal" | "btn_close", device: "pc" | "mo") => {
    return `/images/modal/${type}_${lang}_${device}.png`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0">
          {/* Dimmed Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] cursor-pointer"
          />

          {/* Modal Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            className="relative bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col items-center
                       w-[calc(100%-60px)] md:w-full md:max-w-[540px] mx-auto"
          >
            {/* 메인 공지 이미지 (반응형) */}
            <div className="w-full h-auto overflow-hidden">
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet={getImagePath("modal", "mo")}
                />
                <img
                  src={getImagePath("modal", "pc")}
                  alt="Deadline Announcement"
                  className="w-full h-auto object-contain block"
                />
              </picture>
            </div>

            {/* 닫기 버튼 영역 (반응형 이미지 버튼) */}
            <div className="w-full mt-[-80px] md:mt-[-110px] pb-10 md:pb-14 bg-transparent flex justify-center items-center relative z-10 px-4">
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center relative transition-all active:scale-95 group"
                style={{ minWidth: "44px", minHeight: "44px" }} // 터치 영역 가이드 준수
                aria-label="Close Modal"
              >
                <picture className="w-full flex justify-center">
                  <source
                    media="(max-width: 767px)"
                    srcSet={getImagePath("btn_close", "mo")}
                  />
                  <img
                    src={getImagePath("btn_close", "pc")}
                    alt="Close"
                    className="h-auto w-[90%] max-w-[320px] md:max-w-[180px] object-contain block"
                  />
                </picture>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
