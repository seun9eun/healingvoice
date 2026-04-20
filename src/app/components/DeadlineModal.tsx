import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

interface DeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// TODO: 나중에 실제 이미지 디자인이 나오면 아래 URL을 교체하세요.
const MODAL_IMAGE = {
  ko: "https://via.placeholder.com/800x1000/FFFFFF/44a9ff?text=Healing+Voice+Application+Closed",
  en: "https://via.placeholder.com/800x1000/FFFFFF/44a9ff?text=Healing+Voice+Registration+Closed",
};

export const DeadlineModal = ({ isOpen, onClose }: DeadlineModalProps) => {
  const { t, lang } = useLanguage();

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10">
          {/* Dimmed Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative bg-white rounded-[20px] md:rounded-[30px] overflow-hidden shadow-2xl w-full flex flex-col items-center
                       max-w-full md:max-w-[800px] min-w-0 md:min-w-[500px]"
            style={{ 
              width: "calc(100% - 10px)", // 모바일 좌우 20px 여백 가이드 (부모 p-4/10 고려)
              maxWidth: "800px" 
            }}
          >
            {/* 메인 공지 이미지 슬롯 */}
            <div className="w-full h-auto max-h-[70vh] overflow-y-auto no-scrollbar">
              <img
                src={lang === "en" ? MODAL_IMAGE.en : MODAL_IMAGE.ko}
                alt="Deadline Announcement"
                className="w-full h-auto object-contain block"
              />
            </div>

            {/* 닫기 버튼 영역 */}
            <div className="w-full p-6 md:p-8 bg-white flex justify-center border-t border-gray-50">
              <button
                onClick={onClose}
                className="w-full max-w-[280px] md:max-w-[320px] h-[50px] md:h-[56px] bg-[#444444] hover:bg-black text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg flex items-center justify-center text-[16px] md:text-[18px]"
                style={{ minHeight: "44px", minWidth: "44px" }} // 터치 영역 가이드 준수
              >
                {t("modal.close")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
