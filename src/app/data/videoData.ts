export const DEFAULT_OPEN_TIME = "2026-03-15T08:30:00+09:00";

// 공식영상(YouTubeEmbed) 섹션에 나오는 영상 하나의 데이터 구조.
// id: 유튜브 영상 고유 ID (유튜브 링크의 watch?v=뒤에 오는 문자열, 썸네일/임베드에 사용)
// title/label: 화면에 보이는 제목/카테고리 배지 텍스트
// openTime: 이 값보다 현재 시각이 지나야 화면에 노출됨(YouTubeEmbed.tsx의 filteredVideos 참고)
// isPinned: true면 다른 영상보다 최신이어도 맨 앞(첫번째)에 고정 노출됨 — 없으면 그냥 배열 순서(최신순)대로 노출
export interface Video {
  id: string;
  title: string;
  label: string;
  openTime: string;
  isPinned?: boolean;
}

export const VIDEO_DATA: { ko: Video[]; en: Video[] } = { // 최신순 정렬 (0번이 최신)
  ko: [
    { id: "1vKpHLgop9M", title: "티저 영상", label: "티저", openTime: "2026-08-14T17:00:00+09:00" , isPinned: true },
    { id: "eOS2pRxfWe4", title: "오페라 가수 유영광", label: "홍보", openTime: "2026-05-06T18:00:00+09:00" },
    { id: "w-6Bb2JT1nA", title: "배우 정재광", label: "홍보", openTime: "2026-04-30T18:00:00+09:00" },
    { id: "JbSIKGOeUQ8", title: "가수 김영우", label: "홍보", openTime: "2026-04-30T09:00:00+09:00" },
    { id: "f12qq_NCLbc", title: "가수 간미연", label: "홍보", openTime: "2026-04-28T09:00:00+09:00" },
    { id: "MHQnoiW7bWE", title: "찬양사역자 송정미", label: "홍보", openTime: "2026-04-25T09:00:00+09:00" },
    { id: "zHYonS2OtOE", title: "가수 에녹", label: "홍보", openTime: "2026-04-24T00:00:00+09:00" },
    { id: "0iLEoYPnmFI", title: "모집 기간 연장", label: "티저", openTime: "2026-04-24T12:00:00+09:00"},
    { id: "zbgAqHdZkK8", title: "개그우먼 조혜련", label: "홍보", openTime: "2026-04-21T18:00:00+09:00" },
    { id: "M0i6xhY5bBU", title: "김재원 아나운서", label: "홍보", openTime: "2026-04-15T00:00:00+09:00" },
    { id: "p65TCfUqHDo", title: "2차 모집 티저", label: "티저", openTime: "2026-04-13T00:00:00+09:00" },
    { id: "SDEGM2T-TKo", title: "모집 티저", label: "티저", openTime: DEFAULT_OPEN_TIME },
    { id: "5YqA0qryPPs", title: "티저 영상", label: "티저", openTime: DEFAULT_OPEN_TIME },
  ],
  en: [
    { id: "1vKpHLgop9M", title: "Teaser", label: "TEASER", openTime: "2026-08-14T17:00:00+09:00" , isPinned: true },
    { id: "NJnzBUqRMKo", title: "Yoo Young Kwang", label: "PR", openTime: "2026-05-06T18:00:00+09:00" },
    { id: "U-ICjRTYEr8", title: "Jung Jaekwang", label: "PR", openTime: "2026-04-30T18:00:00+09:00" },
    { id: "tFcFqztRr_I", title: "Kim Youngwoo", label: "PR", openTime: "2026-04-30T09:00:00+09:00" },
    { id: "1b6C0Fkmo5I", title: "Kan Miyoun", label: "PR", openTime: "2026-04-28T09:00:00+09:00" },
    { id: "Qba898x6WH0", title: "Song Jung-Mee", label: "PR", openTime: "2026-04-25T09:00:00+09:00" },
    { id: "vdWpGL89NUY", title: "Enoch", label: "PR", openTime: "2026-04-24T00:00:00+09:00" },
    { id: "AgxCC4l3QnU", title: "Deadline Extended", label: "Teaser", openTime: "2026-04-24T12:00:00+09:00"},
    { id: "hO3FKZak2G0", title: "Cho Hyelyun", label: "PR", openTime: "2026-04-24T12:00:00+09:00" },
    { id: "CjQMdFbPVH4", title: "Kim Jae-won", label: "PR", openTime: "2026-04-15T00:00:00+09:00" },
    { id: "okEbs1xrVU8", title: "2nd Open Call", label: "Teaser", openTime: "2026-04-13T00:00:00+09:00" },
    { id: "tukfPRXn044", title: "Open Call", label: "Teaser", openTime: DEFAULT_OPEN_TIME },
    { id: "pBMPu9lvUOE", title: "Teaser", label: "Teaser", openTime: DEFAULT_OPEN_TIME },
  ],
};
