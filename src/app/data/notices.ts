// src/data/notices.ts
export interface Notice {
  id: number;
  lang: "ko" | "en" | "all"; // 한국어 전용, 영어 전용, 혹은 공통(전체 노출)
  date: string;
  title: string;
  content: string;
  image?: string; // 사진이 있을 때만 경로 입력
}

export const NOTICE_DATA: Notice[] = [
  {
    id: 3,
    lang: "ko",
    date: "2026.02.26",
    title: "국내 지원자 오프라인 면접 안내",
    content: "한국 내 지원자분들은 서울 본사에서 면접이 진행됩니다. 자세한 일정은 개별 문자로 안내드립니다.",
    image: "https://picsum.photos/800/400?random=1" // 예시 이미지
  },
  {
    id: 2,
    lang: "en",
    date: "2026.02.26",
    title: "Global Audition via Zoom",
    content: "For international applicants, we will provide a Zoom link. Please check your email...",
  },
  {
    id: 1,
    lang: "all",
    date: "2026.02.25",
    title: "Healing Voice 2026 Launch!",
    content: "Welcome to the official global audition for Healing Voice.\nJoin us and share your voice!",
    image: "https://picsum.photos/800/400?random=2"
  }
];