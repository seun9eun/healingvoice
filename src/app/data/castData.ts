// src/app/data/castData.ts
export interface CastMember {
  id: number;
  nameKo: string;
  nameEn: string;
  descKo: string;
  descEn: string;
  roleKo: string; // 카드 하이라이트 태그 (Figma "role" 텍스트) — descKo 끝부분과 동일
  roleEn: string; // descEn 안의 역할 표현에서 발췌 (확정 문구 아님, 저위험 직역)
  photo?: string;
}

export const MC_DATA: CastMember[] = [
  {
    id: 1,
    nameKo: "장성규",
    nameEn: "Jang Sungkyu",
    descKo: "센스와 순발력, 진행력을 겸비한 분위기 메이커",
    descEn: "A witty, sharp-minded mood maker with flawless hosting skills",
    roleKo: "",
    roleEn: "",
    photo: "/images/cast/mc_jangsungkyu.jpg",
  },
];

export const MENTOR_DATA: CastMember[] = [
  {
    id: 1,
    nameKo: "송정미",
    nameEn: "Song Jungmee",
    descKo: "깊은 연륜으로 더 큰 성장을 이끄는 동행 멘토",
    descEn: "A guiding mentor walking with contestants toward greater growth through deep experience",
    roleKo: "동행 멘토",
    roleEn: "Guiding Mentor",
    photo: "/images/cast/mentor_songjungmee.jpg",
  },
  {
    id: 2,
    nameKo: "조혜련",
    nameEn: "Cho Hyelyun",
    descKo: "긍정의 에너지로 자신감을 채워주는 에너지 멘토",
    descEn: "An energetic mentor filling contestants with confidence and positivity",
    roleKo: "에너지 멘토",
    roleEn: "Energetic Mentor",
    photo: "/images/cast/mentor_chohyelyun.jpg",
  },
  {
    id: 3,
    nameKo: "김조한",
    nameEn: "Kim Johan",
    descKo: "날카로운 조언으로 숨은 잠재력을 발견하는 성장 멘토",
    descEn: "A growth mentor unlocking hidden potential through sharp, insightful advice",
    roleKo: "성장 멘토",
    roleEn: "Growth Mentor",
    photo: "/images/cast/mentor_kimjohan.jpg",
  },
  {
    id: 4,
    nameKo: "소향",
    nameEn: "Sohyang",
    descKo: "경험을 살려 참가자의 마음까지 헤아리는 공감형 멘토",
    descEn: "An empathetic mentor connecting deeply with contestants through her own journey",
    roleKo: "공감형 멘토",
    roleEn: "Empathetic Mentor",
    photo: "/images/cast/mentor_sohyang.jpg",
  },
  {
    id: 5,
    nameKo: "김영우",
    nameEn: "Kim Youngwoo",
    descKo: "유연한 시선과 통찰력을 겸비한 분석형 멘토",
    descEn: "An analytical mentor combining flexibility and keen insight",
    roleKo: "분석형 멘토",
    roleEn: "Analytical Mentor",
    photo: "/images/cast/mentor_kimyoungwoo.jpg",
  },
];
