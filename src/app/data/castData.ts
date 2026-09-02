// src/app/data/castData.ts
//
// MC(진행자) 1명 + 멘토 5명의 이름/소개문/사진 데이터. Cast.tsx가 이 데이터를 읽어서 카드로 그린다.
// 멘토별로 descKo/descKoMobile/descEn/descEnMobile 총 4개의 소개문 필드가 있는데, 사실 내용은 다
// "같은 문장"이고 줄바꿈("\n") 위치만 화면(모바일/PC)·언어별로 다르다. 왜 하나로 합치지 않았냐면:
// 모바일과 PC는 카드 폭이 완전히 달라서 디자인팀이 "이 지점에서 끊어달라"고 지정한 줄바꿈 위치 자체가
// 서로 다르기 때문이다(CSS가 알아서 줄바꿈하게 두면 디자인 의도와 다른 위치에서 끊길 수 있음).
// *Mobile이 없는 필드(옵셔널, "?")는 PC용 값을 그대로 재사용한다 — Cast.tsx에서
// `member.descEnMobile ?? member.descEn` 처럼 "없으면 PC값 사용"으로 처리하는 부분을 참고.
// 멘토가 5명뿐이고 앞으로도 늘어나지 않을 예정(다른 출연자는 별도 섹션으로 추가될 것)이라, 이 구조를
// 더 일반화(예: "문장 하나 + 줄바꿈 위치 배열")할 필요는 없다고 판단해 지금 형태를 유지함(2026-09-02).
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
