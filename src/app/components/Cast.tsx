import { useLanguage } from "../context/LanguageContext";
import { MC_DATA, MENTOR_DATA, CastMember } from "../data/castData";

// 출연진(Cast) 섹션 에셋 (Figma 답변, 2026-08-27) — 원본 3배수 PNG는 용량이 커서(최대 18MB) 리사이즈+JPEG로 최적화해 저장함
const mcSign = "/images/cast/mc_sign.png";
// 섹션 자체 배경 그룹(bg_출연진, 1178:604) — 조명 그래픽 포함, 알파 투명 원본(2026-08-28 답변)
const bgCastPhoto = "/images/cast/bg_cast.webp";

const titleGradient = "linear-gradient(180deg, #EDF4FF 0%, #B4D3FF 50%, #69A6FF 100%)";
// "힐링멘토 5인" 텍스트는 다른 타이틀과 다르게 흰색→연보라 그라디언트가 위에 한 겹 더 덮여 보임(Figma 답변, 2026-08-28)
const mentorsTitleGradient = "linear-gradient(180deg, #FFFFFF 0%, #A9A9FF 100%)";
// beam light — SVG 벡터 원본 그대로: 흰색→검은색 radial + COLOR_DODGE. 남색 배경 위에서 합성해보면 청록색으로 나오는데,
// 이는 그 배경색 때문이지 이펙트 자체 색이 아님 — 실제 배경(보라색 계열) 위에 dodge를 걸면 마젠타/보라로 보임(2026-08-28 확인)
const beamLight = "radial-gradient(14.82vw 0.1853vw at center, #FFFFFF 0%, #000000 100%)";
// 모바일도 CSS로 근사하는 대신 실제 벡터 SVG 원본 + mix-blend-mode: color-dodge를 그대로 사용(2026-09-01 확인).
// color-dodge는 실제 배경(bg_출연진 사진+그라디언트) 위에서 합성돼야 의도한 색이 나오는데, 이전엔 그 배경 자체가
// 모바일에 없어서 CSS로 억지로 흉내내다 계속 스크린샷과 미묘하게 달랐음 — 배경을 추가한 뒤 원본 방식으로 교체
const beamLightSvg = "/images/cast/beam_light.svg";
// "OO 멘토" 하이라이트: 피그마상 멘토별로 그라데이션/단색이 제각각이나(2026-08-31 재확인), 5개 모두 흰색 단일로 통일하기로 결정
const cardBorder =
  "linear-gradient(180deg, #96F9FF 0%, #C9FEFF 16%, #92C8F2 61%, #889BF0 81%, #8384EF 94%, #E8E8FF 100%)";
// 카드 배경 합성 완료본(#7055D3 단색 + 텍스처 HARD_LIGHT 70% 블렌드, Figma에서 직접 합성해 받음, 2026-08-28)
const cardBg = "/images/cast/mentor_card_bg.jpg";
// Figma 답변으로 받은 정확한 카드 외곽선(368x425 기준 M 56.65 0 L 368 0 L 368 368 L 310.84 425 L 0 425 L 0 56.5 Z)을 %로 환산
const cardClip = "polygon(15.394% 0, 100% 0, 100% 86.588%, 84.467% 100%, 0 100%, 0 13.294%)";

// 모바일(실제 SVG+color-dodge) / 데스크탑(CSS 근사+color-dodge) 두 버전을 각각 그리고 반응형으로 하나만 보이게 함
// 모바일 쪽은 390px 기준 고정 px였던 값을 vw로 환산해 840px(md) 직전까지 유동적으로 스케일되게 함(2026-09-01)
function BeamLight() {
  return (
    <>
      <img
        aria-hidden
        alt=""
        src={beamLightSvg}
        className="md:hidden block w-[92.3077vw] max-w-full h-[4.6154vw] mix-blend-color-dodge"
      />
      <span
        aria-hidden
        className="hidden md:block w-full max-w-[800px] md:h-[0.9375vw] mix-blend-color-dodge"
        style={{ backgroundImage: beamLight, clipPath: "ellipse(50% 50% at center)" }}
      />
    </>
  );
}

function MentorCard({ member, lang }: { member: CastMember; lang: "ko" | "en" }) {
  // Figma 디자인은 국문 설명 끝의 "OO 멘토" 부분만 별도 하이라이트 색으로 분리 표시함
  const bodyKo = member.descKo.replace(member.roleKo, "").trim();

  return (
    <div
      // 모바일 폭을 w-full(%)로 두면 그리드가 justify-items-center(비-stretch)라서 퍼센트 폭이 불확정값이 되어
      // aspect-ratio가 카드 폭이 아니라 내부 텍스트 줄 수(콘텐츠 높이)에 맞춰 카드 크기 자체를 줄여버리는 문제가 있었음
      // (실제로 소개문이 2줄로 짧아진 첫 카드만 눈에 띄게 작아짐, 2026-09-01 확인) — 고정폭을 유지하되 vw로 환산해 반응형 처리
      className="relative w-[44.1026vw] md:w-[19.1667vw] aspect-[172/236] md:aspect-[368/425] p-[1.0256vw] md:p-[0.2083vw] shrink-0"
      style={{ backgroundImage: cardBorder, clipPath: cardClip }}
    >
      <div
        className="relative size-full overflow-hidden bg-[#061E49] bg-cover bg-center"
        style={{ backgroundImage: `url(${cardBg})`, clipPath: cardClip }}
      >
        <div className="relative z-10 flex flex-col items-center gap-[1.0256vw] md:gap-[0.4167vw] pt-[4.6154vw] md:pt-[2vw] px-[3.0769vw]">
          {lang === "ko" && member.nameImage ? (
            <img src={member.nameImage} alt={member.nameKo} className="h-[6.1538vw] md:h-[2.1vw] w-auto object-contain" />
          ) : lang === "en" && member.nameImageEn ? (
            <img src={member.nameImageEn} alt={member.nameEn} className="h-[6.1538vw] md:h-[2.1vw] w-auto object-contain" />
          ) : (
            <p className="text-[5.1282vw] md:text-[1.5vw] leading-[1.2] text-center font-extrabold text-white">
              {member.nameEn}
            </p>
          )}
          {/* 소개문-역할 사이는 실제 gap이 아니라 행간 여백으로 만들어짐(2026-09-01 확인) — gap 없앰 */}
          <div className="flex w-full flex-col items-center gap-0 md:gap-[0.2083vw]">
            {/* 스크린샷 대조 결과 소개문은 Medium이 아니라 Regular로 보임(2026-09-01) — 슬랙 답변과 실제 렌더가 달라 실측 우선 */}
            <p className={`text-[3.0769vw] ${lang === "en" ? "md:text-[1.0417vw]" : "md:text-[0.9375vw]"} font-normal leading-[1.3] md:leading-[1.4] text-center text-white`}>
              {(lang === "ko" ? bodyKo : member.descEn).split("\n").map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
            {/* 영문판은 역할 태그가 소개 문장에 통합되어 있어 별도 줄이 없음(2026-08-31 확인) */}
            {lang === "ko" && (
              <p className="text-[3.0769vw] md:text-[1.1458vw] leading-[1.3] md:leading-[1.2] tracking-[-0.05em] text-center font-bold text-white">
                {member.roleKo}
              </p>
            )}
          </div>
        </div>
        {/* 사진은 카드보다 넓게(122.8%) 오버플로되며 카드 y34.6% 지점부터 시작 — 스펙 비율(462:291)로 크롭해서 원본 파일 비율 차이에 영향받지 않도록 처리 */}
        {/* 영문판은 소개문이 3줄이라 34.6%로는 사진과 겹침 — 텍스트 블록 실측 높이만큼 내려서 여유 확보(2026-08-31 확인) */}
        {member.photo && (
          <div className={`absolute inset-x-0 ${lang === "en" ? "top-[42%]" : "top-[34.6%]"} bottom-0 flex items-end justify-center overflow-visible`}>
            <img
              src={member.photo}
              alt={member.nameKo}
              className="w-[122.8%] max-w-none aspect-[462/291] object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function Cast() {
  const { t, lang } = useLanguage();
  const mc = MC_DATA[0];
  const [row1, row2] = [MENTOR_DATA.slice(0, 2), MENTOR_DATA.slice(2)];

  return (
    <section
      id="cast"
      className="relative w-full flex flex-col items-center gap-[12.3077vw] md:gap-[3.3333vw] overflow-hidden px-[4.1026vw] md:px-[18.75vw] pt-[24.6154vw] pb-0 md:py-[6.25vw]"
    >
      {/* 섹션 자체 배경(bg_출연진, Figma 1178:603) — 조명 그래픽 사진 + 상단 그라디언트.
          모바일도 동일한 배경 그룹이 존재함을 상세 스펙에서 재확인(2026-09-01) — "공용 배경만 있음"은 착오였음 */}
      <div
        className="hidden md:block absolute -z-10 pointer-events-none"
        style={{ left: "-4.115vw", top: "-1.979vw", width: "108.229vw", height: "131.615vw" }}
        aria-hidden
      >
        <img src={bgCastPhoto} alt="" className="w-full h-full object-cover" />
      </div>
      <div
        className="hidden md:block absolute -z-10 w-full pointer-events-none"
        style={{
          top: "-1.979vw",
          height: "40vw",
          backgroundImage: "linear-gradient(to top, rgba(21,57,118,0) 0%, #00163b 100%)",
        }}
        aria-hidden
      />
      {/* 모바일 버전(390px 프레임 기준 실측 좌표를 vw로 환산, 2026-09-01 확인: bg 그룹 x-933 y-8.63 2115.42x2028) */}
      <div
        className="md:hidden absolute -z-10 pointer-events-none"
        style={{ left: "-239.2308vw", top: "-2.2128vw", width: "542.4154vw", height: "520vw" }}
        aria-hidden
      >
        <img src={bgCastPhoto} alt="" className="w-full h-full object-cover" />
      </div>
      <div
        className="md:hidden absolute -z-10 w-full pointer-events-none"
        style={{
          top: 0,
          height: "155.5744vw",
          backgroundImage: "linear-gradient(180deg, #00163B 0%, #00163B 7.41%, rgba(21,57,118,0) 100%)",
        }}
        aria-hidden
      />
      {/* MC 뒤 보라색 글로우(Figma 1178:610, glow) */}
      <div
        className="hidden md:block absolute -z-10 rounded-full opacity-70 mix-blend-screen pointer-events-none"
        style={{
          left: "40.365vw",
          top: "16.302vw",
          width: "37.031vw",
          height: "37.031vw",
          backgroundImage: "radial-gradient(circle, #722FF6 0%, rgba(26,0,255,0) 75%)",
        }}
        aria-hidden
      />

      {/* 타이틀 — 국문 모바일 스펙 확인(2026-09-01): eyebrow 16px #44a9ff, 제목 40px, 부제 #7d7d7d */}
      <div className="flex flex-col items-center gap-[4.1026vw] md:gap-[0.8333vw] w-full max-w-[1200px] text-center">
        <span className="text-[#44A9FF] md:text-[#4D94FF] font-bold uppercase tracking-[0.4103vw] md:tracking-[1.6px] text-[4.1026vw] md:text-[0.8333vw]">
          {t("cast.eyebrow")}
        </span>
        <h2
          className="text-[10.2564vw] leading-[8.9744vw] md:text-[2.9167vw] md:leading-tight font-black uppercase text-transparent bg-clip-text"
          style={{ backgroundImage: titleGradient, fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
        >
          {t("cast.title")}
        </h2>
        {/* 컨테이너 724px(1920 기준, 2026-08-31 확인) — 이전 527px는 너무 좁아 한 줄로 안 나옴 */}
        <p className="max-w-[135.1282vw] md:max-w-[37.708vw] text-[#D4EBFF] text-[4.1026vw] md:text-[1.1458vw] font-normal leading-[1.5] md:leading-[1.4] md:whitespace-nowrap">
          {/* 국문 모바일: "~함께할" / "MC와~" 2줄로 고정(2026-09-01 확인) */}
          {lang === "ko" ? (
            <>
              {t("cast.desc").replace("MC와 힐링멘토를 소개합니다", "").trim()}
              <br className="md:hidden" />
              <span className="md:hidden">MC와 힐링멘토를 소개합니다</span>
              <span className="hidden md:inline"> MC와 힐링멘토를 소개합니다</span>
            </>
          ) : (
            t("cast.desc")
          )}
        </p>
      </div>

      {/* MC */}
      <div className="flex flex-col md:flex-row items-center w-full max-w-[1200px] gap-[6.1538vw] md:gap-[1.25vw] rounded-[8.2051vw] md:rounded-[2.5vw] md:px-[6.25vw]">
        {/* 모바일은 이미지 위/텍스트 아래, 데스크탑은 텍스트 좌/이미지 우(2026-08-31 모바일 스펙) */}
        {/* 영문판 설명 텍스트가 국문보다 넓어(363px, 2026-08-31 확인) 폭을 언어별로 분리 */}
        <div className={`order-2 md:order-1 flex flex-col items-center gap-[2.0513vw] md:gap-[0.4167vw] ${lang === "en" ? "md:w-[18.906vw]" : "md:w-[14.479vw]"} shrink-0 text-center`}>
          {lang === "ko" ? (
            // "MC 장성규"도 "힐링멘토 5인"과 동일한 흰색→연보라 그라데이션(2026-09-01 재확인)
            <p
              className="text-[7.1795vw] md:text-[2.0833vw] leading-none font-extrabold text-transparent bg-clip-text"
              style={{ backgroundImage: mentorsTitleGradient, fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
            >
              {t("cast.mcLabel")}
            </p>
          ) : (
            // 영문판은 "Host"/"Jang Sungkyu" 두 줄로 분리(2026-08-31 확인). 둘 다 그라데이션 적용
            <p className="text-[6.1538vw] md:text-[2.0833vw] leading-tight font-extrabold" style={{ fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}>
              <span className="uppercase text-transparent bg-clip-text" style={{ backgroundImage: titleGradient }}>Host</span>
              <br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: mentorsTitleGradient }}>{mc.nameEn}</span>
            </p>
          )}
          <p className={`text-[4.1026vw] md:text-[1.25vw] leading-[1.4] tracking-[-0.1692vw] md:tracking-[-0.03em] ${lang === "en" ? "font-normal" : "font-medium"} text-white break-keep`}>
            {lang === "ko"
              ? mc.descKo.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))
              : mc.descEn.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
          </p>
        </div>
        {mc.photo && (
          <div className="order-1 md:order-2 relative w-full max-w-[520px] md:max-w-none md:flex-1">
            {/* 모바일은 사각형 사진이 아니라 가장자리가 배경으로 은은하게 페이드되는 형태(2026-09-01 스크린샷 확인) — radial mask로 처리 */}
            <img
              src={mc.photo}
              alt={mc.nameKo}
              className="md:hidden w-full h-[80.2564vw] object-cover object-top"
              style={{
                maskImage: "radial-gradient(ellipse 92% 78% at 50% 40%, black 60%, transparent 98%)",
                WebkitMaskImage: "radial-gradient(ellipse 92% 78% at 50% 40%, black 60%, transparent 98%)",
              }}
            />
            <img
              src={mc.photo}
              alt={mc.nameKo}
              className="hidden md:block w-full md:h-[30.104vw] object-cover object-top md:rounded-[2.5vw]"
            />
            {/* MC 사인("힐링보이스 장성규") — 사진 우상단 근처, Figma 좌표 환산(사진 대비 left 69%, top 20%, width 21.6%) */}
            <img
              src={mcSign}
              alt=""
              className="absolute w-[21.6%] left-[69%] top-[20%] h-auto object-contain"
            />
          </div>
        )}
      </div>

      {/* 힐링멘토 */}
      <div className="flex flex-col items-center gap-[8.2051vw] md:gap-[1.6667vw] w-full max-w-[1200px]">
        <div className="flex flex-col items-center gap-[2.0513vw] md:gap-[0.4167vw] w-full max-w-[800px] pt-[8.2051vw] pb-[1.0256vw] md:py-[0.8333vw]">
          {/* beam light — 텍스트 위/아래 가로 빛줄기 */}
          <BeamLight />
          <h3
            className="text-[8.2051vw] leading-[12.3077vw] md:text-[2.5vw] md:leading-tight font-black text-transparent bg-clip-text"
            style={{
              backgroundImage: mentorsTitleGradient,
              fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif",
            }}
          >
            {t("cast.mentorsTitle")}
          </h3>
          <BeamLight />
        </div>

        {/* 데스크탑: 2장 + 3장 두 줄 / 모바일: 2열 그리드 */}
        <div className="hidden md:flex items-center gap-[1.6667vw]">
          {row1.map((m) => (
            <MentorCard key={m.id} member={m} lang={lang} />
          ))}
        </div>
        <div className="hidden md:flex items-center gap-[1.6667vw]">
          {row2.map((m) => (
            <MentorCard key={m.id} member={m} lang={lang} />
          ))}
        </div>
        {/* 모바일: 2열 그리드, 마지막 1장만 중앙 정렬(2x2+1, 2026-08-31 모바일 스펙) */}
        <div className="grid grid-cols-2 gap-x-[3.0769vw] gap-y-[8.2051vw] w-full md:hidden justify-items-center">
          {MENTOR_DATA.map((m, i) => (
            <div key={m.id} className={i === MENTOR_DATA.length - 1 ? "col-span-2" : ""}>
              <MentorCard member={m} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
