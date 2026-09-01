// src/app/data/castData.ts
export interface CastMember {
  id: number;
  nameKo: string;
  nameEn: string;
  descKo: string;
  descKoMobile?: string; // 모바일 전용 하드 개행(2026-09-01 확인) — PC(descKo)는 강제 줄바꿈 없이 자연 줄바꿈
  descEn: string;
  descEnMobile?: string; // 모바일 전용 하드 개행(2026-09-01 재확인) — PC(descEn)와 줄바꿈 위치가 다름
  roleKo: string; // 카드 하이라이트 태그 (Figma "role" 텍스트) — descKo 끝부분과 동일
  roleEn: string; // descEn 안의 역할 표현에서 발췌 (확정 문구 아님, 저위험 직역)
  photo?: string;
  nameImage?: string; // Figma상 이름이 스타일링된 이미지로 되어있음(국문)
  nameImageEn?: string; // 영문판 전용 이름 이미지(2026-08-31 답변, 이름마다 개별 이미지 폭이 다름)
}

export const MC_DATA: CastMember[] = [
  {
    id: 1,
    nameKo: "장성규",
    nameEn: "Jang Sungkyu",
    descKo: "센스와 순발력,\n진행력을 겸비한 분위기 메이커",
    descEn: "A witty, sharp-minded mood maker\nwith flawless hosting skills", // 2026-08-31 확인: 원문 줄바꿈 있음(2줄)
    roleKo: "",
    roleEn: "",
    photo: "/images/cast/mc_jangsungkyu.png",
  },
];

export const MENTOR_DATA: CastMember[] = [
  {
    id: 1,
    nameKo: "송정미",
    nameEn: "Song Jungmee",
    descKo: "깊은 연륜으로 더 큰 성장을 이끄는 동행 멘토", // PC는 자연 줄바꿈(강제 개행 없음)
    // 국문 모바일 실제 하드 개행 위치 확인(2026-09-01): "깊은 연륜으로" / "더 큰 성장을 이끄는"
    descKoMobile: "깊은 연륜으로\n더 큰 성장을 이끄는 동행 멘토",
    descEn: "A guiding mentor walking with\ncontestants toward greater growth\nthrough deep experience", // 2026-08-31 확인: 실제 줄바꿈 위치(PC)
    descEnMobile: "A guiding mentor\nwalking with contestants toward greater growth through deep experience", // 2026-09-01 확인: 모바일 줄바꿈 위치
    roleKo: "동행 멘토",
    roleEn: "Guiding Mentor",
    photo: "/images/cast/mentor_songjungmee.png",
    nameImage: "/images/cast/name_songjungmee.png",
    nameImageEn: "/images/cast/name_en_songjungmee.png",
  },
  {
    id: 2,
    nameKo: "조혜련",
    nameEn: "Cho Hyelyun",
    descKo: "긍정의 에너지로 자신감을 채워주는 에너지 멘토", // PC는 자연 줄바꿈(강제 개행 없음)
    // 국문 모바일 실제 하드 개행 위치 확인(2026-09-01): "긍정의 에너지로" / "자신감을 채워주는"
    descKoMobile: "긍정의 에너지로\n자신감을 채워주는 에너지 멘토",
    descEn: "An energetic mentor\nfilling contestants\nwith confidence and positivity", // 2026-08-31 확인: 실제 줄바꿈 위치(PC)
    descEnMobile: "An energetic mentor\nfilling contestants with confidence and\npositivity", // 2026-09-01 확인: 모바일 줄바꿈 위치
    roleKo: "에너지 멘토",
    roleEn: "Energetic Mentor",
    photo: "/images/cast/mentor_chohyelyun.png",
    nameImage: "/images/cast/name_chohyelyun.png",
    nameImageEn: "/images/cast/name_en_chohyelyun.png",
  },
  {
    id: 3,
    nameKo: "김조한",
    nameEn: "Kim Johan",
    descKo: "날카로운 조언으로 숨은 잠재력을 발견하는 성장 멘토", // PC는 자연 줄바꿈(강제 개행 없음)
    // 국문 모바일 실제 하드 개행 위치 확인(2026-09-01): "날카로운 조언으로" / "숨은 잠재력을 발견하는"
    descKoMobile: "날카로운 조언으로\n숨은 잠재력을 발견하는 성장 멘토",
    descEn: "A growth mentor\nunlocking hidden potential\nthrough sharp, insightful advice", // 2026-08-31 확인: 실제 줄바꿈 위치(PC)
    descEnMobile: "A growth mentor\nunlocking hidden potential through sharp,\ninsightful advice", // 2026-09-01 확인: 모바일 줄바꿈 위치
    roleKo: "성장 멘토",
    roleEn: "Growth Mentor",
    photo: "/images/cast/mentor_kimjohan.png",
    nameImage: "/images/cast/name_kimjohan.png",
    nameImageEn: "/images/cast/name_en_kimjohan.png",
  },
  {
    id: 4,
    nameKo: "소향",
    nameEn: "Sohyang",
    descKo: "경험을 살려 참가자의 마음까지 헤아리는 공감형 멘토", // PC는 자연 줄바꿈(강제 개행 없음)
    // 국문 모바일 실제 하드 개행 위치 확인(2026-09-01): "경험을 살려" / "참가자의 마음까지 헤아리는"
    descKoMobile: "경험을 살려\n참가자의 마음까지 헤아리는 공감형 멘토",
    descEn: "An empathetic mentor\nconnecting deeply with contestants\nthrough her own journey", // 2026-08-31 확인: 실제 줄바꿈 위치(PC)
    descEnMobile: "An empathetic mentor connecting deeply\nwith contestants through\nher own journey", // 2026-09-01 확인: 모바일 줄바꿈 위치
    roleKo: "공감형 멘토",
    roleEn: "Empathetic Mentor",
    photo: "/images/cast/mentor_sohyang.png",
    nameImage: "/images/cast/name_sohyang.png",
    nameImageEn: "/images/cast/name_en_sohyang.png",
  },
  {
    id: 5,
    nameKo: "김영우",
    nameEn: "Kim Youngwoo",
    descKo: "유연한 시선과 통찰력을 겸비한 분석형 멘토", // PC는 자연 줄바꿈(강제 개행 없음)
    // 국문 모바일 실제 하드 개행 위치 확인(2026-09-01): "유연한 시선과" / "통찰력을 겸비한"
    descKoMobile: "유연한 시선과\n통찰력을 겸비한 분석형 멘토",
    descEn: "An analytical mentor\ncombining flexibility\nand keen insight", // 2026-08-31 확인: 실제 줄바꿈 위치(PC)
    descEnMobile: "An analytical mentor\ncombining flexibility\nand keen insight", // 2026-09-01 확인: 모바일 줄바꿈 위치(PC와 동일)
    roleKo: "분석형 멘토",
    roleEn: "Analytical Mentor",
    photo: "/images/cast/mentor_kimyoungwoo.png",
    nameImage: "/images/cast/name_kimyoungwoo.png",
    nameImageEn: "/images/cast/name_en_kimyoungwoo.png",
  },
];
