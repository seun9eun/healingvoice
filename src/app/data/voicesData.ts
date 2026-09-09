// src/app/data/voicesData.ts
//
// 보이스(Voices) 32인 데이터. Voices.tsx가 이 배열 순서대로 8행 x 4열 그리드를 그린다.
// 순서는 Figma `보이스` 섹션(1746:438)의 노출 순서(좌→우, 위→아래)를 그대로 따른다.
//
// photo 경로의 번호는 이 배열의 인덱스와 1:1로 대응한다(voice_01 = 배열 첫 번째).
// 이미지는 scripts/build-voice-images.mjs가 원본(저장소 밖 _assets/voices_original)에서
// 카드 크기로 잘라 만든 것이라, 이름을 바꾸려면 스크립트의 ORDER 배열도 같이 고쳐야 한다.
//
// 이름(영문)과 소개글은 기획 구글시트 두 번째 탭에서 가져왔다(2026-09-09).
// descKo/descEn은 카드에는 안 쓰인다 — Figma 카드에는 이름만 있고 소개글이 없다.
// 인물별 모달에 들어갈 문구인데 모달 디자인이 아직 안 나와서, 데이터만 넣어두고 화면에는 붙이지 않았다.
export interface Voice {
  id: number;
  nameKo: string;
  nameEn: string;
  descKo: string; // 모달용 — 현재 미사용
  descEn: string; // 모달용 — 현재 미사용
  photo: string;
  photoModal?: string; // 모달 디자인이 나오면 채운다
}

export const VOICES_DATA: Voice[] = [
  {
    id: 1,
    nameKo: "김성결",
    nameEn: "Kim Sung Gyeul",
    descKo: "세계 무대를 누비는 대한민국 오페라의 얼굴",
    descEn: "The face of Korean opera on the global stage",
    photo: "/images/voices/voice_01.webp",
  },
  {
    id: 2,
    nameKo: "김성신",
    nameEn: "Kim Sung Shin",
    descKo: "CCM 걸그룹 ‘RoseM’ 출신의 베테랑 보이스",
    descEn: "A veteran voice formerly of the CCM group 'RoseM'",
    photo: "/images/voices/voice_02.webp",
  },
  {
    id: 3,
    nameKo: "김신의",
    nameEn: "Kim Si-Ni",
    descKo: "CCM의 부흥을 위해 나선 대한민국 대표 록커",
    descEn: "Korea's premier rocker standing up for a CCM revival",
    photo: "/images/voices/voice_03.webp",
  },
  {
    id: 4,
    nameKo: "김예은",
    nameEn: "Kim Ye Eun",
    descKo: "뮤지컬·팝페라·트로트를 아우르는 만능 보컬",
    descEn: "An all-around vocalist spanning musical theater, popera, and trot",
    photo: "/images/voices/voice_04.webp",
  },
  {
    id: 5,
    nameKo: "김하준",
    nameEn: "Kim Ha Jun",
    descKo: "배우에서 가수로! 잘생긴 교회 오빠",
    descEn: "From actor to singer - the handsome church guy!",
    photo: "/images/voices/voice_05.webp",
  },
  {
    id: 6,
    nameKo: "김호준",
    nameEn: "Kim Ho Jun",
    descKo: "‘날 것’의 감성으로 노래하는 싱어송라이터",
    descEn: "A singer-songwriter singing with raw, authentic emotion",
    photo: "/images/voices/voice_06.webp",
  },
  {
    id: 7,
    nameKo: "나시온",
    nameEn: "Na Zion",
    descKo: "찬양과 생업, 육아까지 책임지는 새내기 아빠",
    descEn: "A rookie dad balancing worship, work, and parenting",
    photo: "/images/voices/voice_07.webp",
  },
  {
    id: 8,
    nameKo: "라이야",
    nameEn: "Riah",
    descKo: "미국에서 온 본토 블랙 가스펠의 진수",
    descEn: "Authentic black gospel straight from the US",
    photo: "/images/voices/voice_08.webp",
  },
  {
    id: 9,
    nameKo: "림팍",
    nameEn: "Rim Park",
    descKo: "오페라부터 뮤지컬까지 섭렵한 바주카포 테너",
    descEn: "A spinto tenor mastering everything from opera to musicals",
    photo: "/images/voices/voice_09.webp",
  },
  {
    id: 10,
    // 시트 표기는 "삼손 멜로디 or 멜로디" / "Melody Samson or Melody".
    // Figma 카드가 짧은 쪽(멜로디)이라 카드 표기는 짧은 이름으로 맞췄다.
    // 시트는 "삼손 멜로디"로 가나다 정렬돼 13번에 있지만, 그리드 순서는 Figma 기준이라 여기가 맞다.
    nameKo: "멜로디",
    nameEn: "Melody",
    descKo: "찬양으로 위로를 전하고 싶은 필리핀 사역자",
    descEn: "A Filipino minister wishing to spread comfort through praise",
    photo: "/images/voices/voice_10.webp",
  },
  {
    id: 11,
    nameKo: "문은수",
    nameEn: "Moon Eun Soo",
    descKo: "맑은 목소리로 주님을 노래하는 뮤지컬 배우",
    descEn: "A musical actor singing praise to the Lord with a pure voice",
    photo: "/images/voices/voice_11.webp",
  },
  {
    id: 12,
    nameKo: "박연홍",
    nameEn: "Park Yeon Hong",
    descKo: "타고난 달란트로 무대를 압도하는 숨은 보석",
    descEn: "A hidden gem dominating the stage with natural talent",
    photo: "/images/voices/voice_12.webp",
  },
  {
    id: 13,
    nameKo: "박예음",
    nameEn: "Park Ye Eum",
    descKo: "음악 유전자를 물려받은 올라운더 감성 보컬",
    descEn: "An all-rounder emotional vocalist carrying musical genetics",
    photo: "/images/voices/voice_13.webp",
  },
  {
    id: 14,
    nameKo: "석상은",
    nameEn: "Suk Sang Eun",
    descKo: "서울대 ‘샌드 페블즈’ 출신의 중저음 보컬리스트",
    descEn: "A deep-toned vocalist from Seoul National University's 'Sand Pebbles'",
    photo: "/images/voices/voice_14.webp",
  },
  {
    id: 15,
    nameKo: "아삽",
    nameEn: "Asaph",
    descKo: "힙합부터 CCM까지 아우르는 크리스천 아티스트",
    descEn: "A Christian artist spanning hip-hop to CCM",
    photo: "/images/voices/voice_15.webp",
  },
  {
    id: 16,
    nameKo: "예잔",
    nameEn: "Yejan",
    descKo: "정통 K-발라드 그룹 ‘가비엔제이’ 메인 보컬",
    descEn: "Main vocalist of the authentic K-ballad group 'Gavy NJ'",
    photo: "/images/voices/voice_16.webp",
  },
  {
    id: 17,
    nameKo: "유난이",
    nameEn: "You Nan Yi",
    descKo: "무대 뒤에서 내공을 쌓아온 베테랑 코러스 세션",
    descEn: "A veteran backing vocalist who built her skills behind the scenes",
    photo: "/images/voices/voice_17.webp",
  },
  {
    id: 18,
    nameKo: "이철규",
    nameEn: "Lee Cheol Kyu",
    descKo: "압도적인 실력과 대중성을 갖춘 헤리티지 원년 멤버",
    descEn: "Original member of 'Heritage' with overwhelming talent and popular appeal",
    photo: "/images/voices/voice_18.webp",
  },
  {
    id: 19,
    nameKo: "임보민",
    nameEn: "Lim Bo Min",
    descKo: "찬양 사역자로 다시 태어난 아이돌 출신 전도사",
    descEn: "An idol-turned-evangelist reborn as a worship minister",
    photo: "/images/voices/voice_19.webp",
  },
  {
    id: 20,
    nameKo: "임성규",
    nameEn: "Lim Sung Kyu",
    descKo: "따뜻한 음색으로 위로를 전하는 ‘같이 걸어가기’ 멤버",
    descEn: "A member of 'Walking Humbly' offering comfort with a warm voice",
    photo: "/images/voices/voice_20.webp",
  },
  {
    id: 21,
    nameKo: "장근희",
    nameEn: "Jang Geun Hee",
    descKo: "서바이벌에 첫 도전하는 CCM계 레전드",
    descEn: "A legend in CCM taking on her first survival show challenge",
    photo: "/images/voices/voice_21.webp",
  },
  {
    id: 22,
    nameKo: "전기수",
    nameEn: "Jeon Gi Su",
    descKo: "선교원에서 자란 이 시대의 ‘강한 용사’",
    descEn: "A modern-day 'mighty warrior' raised in a church preschool",
    photo: "/images/voices/voice_22.webp",
  },
  {
    id: 23,
    nameKo: "전덕호",
    nameEn: "Jeon Deok Ho",
    // 시트 비고: 소속 밴드 공식 표기가 'Super Kidd'
    descKo: "고난과 역경에도 웃으며 노래하는 영원한 ‘슈퍼키드’",
    descEn: "An eternal 'Super Kidd' singing through hardships with a smile",
    photo: "/images/voices/voice_23.webp",
  },
  {
    id: 24,
    nameKo: "정지훈",
    nameEn: "Jeong Ji Hoon",
    descKo: "대형 기획사들의 러브콜을 받은 비주얼 보이스",
    descEn: "A visual vocalist pursued by major agencies",
    photo: "/images/voices/voice_24.webp",
  },
  {
    id: 25,
    nameKo: "조수아",
    nameEn: "Cho Soo Ah",
    descKo: "떡잎부터 남다른 CCM 새싹의 등장",
    descEn: "A rising CCM star showing promise from the very start",
    photo: "/images/voices/voice_25.webp",
  },
  {
    id: 26,
    nameKo: "지은혜",
    nameEn: "Ji Eun Hye",
    descKo: "동심을 노래하는 뮤지컬 극단 단장",
    descEn: "A musical troupe leader singing with the pure heart of children",
    photo: "/images/voices/voice_26.webp",
  },
  {
    id: 27,
    nameKo: "초롬",
    nameEn: "Chorom",
    descKo: "탄탄한 보이스로 주님을 찬양하는 실력파 CCM 가수",
    descEn: "A skilled CCM singer praising the Lord with a solid voice",
    photo: "/images/voices/voice_27.webp",
  },
  {
    id: 28,
    nameKo: "최서희",
    nameEn: "Choi Seo Hee",
    descKo: "청아한 목소리로 마음을 전하는 뮤지컬 배우 지망생",
    descEn: "An aspiring musical actor touching hearts with a pure voice",
    photo: "/images/voices/voice_28.webp",
  },
  {
    id: 29,
    // 시트 표기는 "케지아 케이틀린 or 케지아" / "Kezia Kaithlyn or Kezia". 멜로디와 같은 이유로 짧은 이름 사용.
    nameKo: "케지아",
    nameEn: "Kezia",
    descKo: "5천만 스트리밍을 기록한 인도네시아 가수",
    descEn: "An Indonesian singer with 50 million streams",
    photo: "/images/voices/voice_29.webp",
  },
  {
    id: 30,
    nameKo: "키디비",
    nameEn: "KittiB",
    descKo: "긴 방황 끝에 믿음으로 다시 일어선 힙합 여전사",
    descEn: "A hip-hop queen standing tall again in faith after a long detour",
    photo: "/images/voices/voice_30.webp",
  },
  {
    id: 31,
    nameKo: "피터",
    nameEn: "PEtER", // 시트 표기 그대로(대소문자 혼용이 활동명 표기로 보임)
    descKo: "K-POP으로 복음을 전하는 ‘킹덤팝’ 아티스트",
    descEn: "A 'Kingdom Pop' artist spreading the Gospel through K-POP",
    photo: "/images/voices/voice_31.webp",
  },
  {
    id: 32,
    nameKo: "호림",
    nameEn: "Horim",
    descKo: "독보적인 음악성으로 주님을 찬양하는 돌아온 탕자",
    descEn: "A returning prodigal son praising the Lord with unique artistry",
    photo: "/images/voices/voice_32.webp",
  },
];
