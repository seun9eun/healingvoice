import { useLanguage } from "../context/LanguageContext";
import { MC_DATA, MENTOR_DATA, CastMember } from "../data/castData";
import { Reveal } from "./Reveal";
import { titleGradient, brandGradient } from "../theme";
import { renderLines } from "../lib/text";

// ─────────────────────────────────────────────────────────────────────────
// 출연진(Cast) 섹션 — 이 파일은 이 프로젝트의 섹션 컴포넌트 중 가장 복잡해서,
// 다른 섹션(Hero/BigText/Awards 등)에도 공통으로 적용되는 패턴을 여기서 한번에 설명한다.
// (처음 이 코드베이스를 보는 사람은 이 주석부터 읽는 걸 권장)
//
// 1) 반응형 단위: 이 사이트는 픽셀(px) 대신 vw(뷰포트 폭의 %)를 거의 전부 사용한다.
//    예를 들어 "text-[3.0769vw]"는 "화면 폭의 3.0769%"라는 뜻이다.
//    모바일은 피그마 디자인 기준폭 390px을, 데스크탑(md: 이상)은 1920px을 기준으로
//    "px값 / 기준폭 * 100"으로 변환해서 넣어뒀다. 이렇게 하면 화면 크기가 달라져도
//    디자인 그대로의 비율로 요소들이 같이 커지고 작아진다(= 반응형).
//    그래서 숫자만 보면 이상해 보여도(예: 44.1026vw) 실제로는 "모바일 기준 172px"처럼
//    정확한 의도가 있는 값이니 임의로 반올림하거나 바꾸지 말 것 — 바꿔야 할 땐 원래 px값을
//    구해서 같은 공식으로 다시 계산해야 한다.
//
// 2) 모바일/PC 분기 2가지 방식이 섞여 있다:
//    - 하나의 요소에 반응형 클래스를 같이 쓰는 방식: "text-[3.0769vw] md:text-[0.9375vw]"
//      (모바일 기본값 + md: 접두사로 840px 이상일 때 다른 값) — 크기/간격처럼 값만 다를 때 사용
//    - 아예 다른 마크업 두 벌을 만들어 하나만 보이게 하는 방식: className에 "md:hidden"과
//      "hidden md:block"(또는 md:flex)을 각각 붙인 두 요소를 나란히 두는 것 — 줄바꿈 위치나
//      요소 배치 순서 자체가 모바일/PC에서 완전히 다를 때 사용(이 파일의 멘토 카드 소개문이 예시)
//
// 3) 국문/영문 분기: useLanguage()의 lang이 "ko"/"en"이고, {lang === "ko" ? <KO버전/> : <EN버전/>}
//    형태로 곳곳에 갈려있다. 영문판은 프로젝트에 없는 폰트(예: HiKR, KoreanHDRIB)로 디자인된
//    텍스트가 많아서, 그런 경우는 실제 폰트 대신 미리 만들어둔 이미지 파일로 대체한 부분이 많다
//    (주석에 "폰트 없어 이미지로 대체"라고 적힌 곳들).
//
// 4) 숫자/좌표는 대부분 실제로 Figma 디자인 파일을 보고 있는 담당 기획자에게 슬랙으로 물어봐서
//    받은 실측값이다(주석의 "2026-XX-XX 확인"이 그 날짜). 화면이 이상해 보인다고 숫자를 감으로
//    바꾸기보다는, 먼저 실제 스크린샷과 비교하거나 다시 물어보고 정확한 값으로 고치는 걸 권장한다
//    (이번 세션에서 실제로 슬랙 답변이 스크린샷과 다르게 온 적이 몇 번 있었음 — 화면 실측이 항상 우선).
// ─────────────────────────────────────────────────────────────────────────

// 출연진(Cast) 섹션 에셋 (Figma 답변, 2026-08-27) — 원본 3배수 PNG는 용량이 커서(최대 18MB) 리사이즈+JPEG로 최적화해 저장함
const mcSign = "/images/cast/mc_sign.png";
// 섹션 자체 배경 그룹(bg_출연진, 1178:604) — 조명 그래픽 포함, 알파 투명 원본(2026-08-28 답변)
const bgCastPhoto = "/images/cast/bg_cast.webp";

// "힐링멘토 5인"/"MC 이름" 텍스트는 다른 타이틀과 다르게 흰색→연보라 그라디언트가 위에 한 겹 더 덮여 보임(Figma 답변, 2026-08-28)
// theme.ts의 brandGradient와 값이 같아서(2026-09-02 확인) 그쪽 값을 그대로 가져와 이 파일 안에서 쓰던 이름을 유지함
const mentorsTitleGradient = brandGradient;
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
  const bodyKoMobile = (member.descKoMobile ?? member.descKo).replace(member.roleKo, "").trim();

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
        {/* min-h-full: 아래 모바일 사진의 mt-auto가 "남는 세로 공간"을 계산하려면 이 컨테이너가 카드 안쪽
            높이를 채워야 함(높이가 콘텐츠에 맞춰지면 남는 공간이 늘 0이라 mt-auto가 무의미).
            h-full이 아니라 min-h-full인 이유: 높이를 고정하면 콘텐츠가 넘칠 때 flex가 이름·소개문을
            압축해 카드마다 레이아웃이 달라짐. min-h-full은 넘칠 때 컨테이너가 늘어나 압축이 생기지 않음 */}
        <div className="relative z-10 flex min-h-full flex-col items-center gap-[1.0256vw] md:gap-[0.4167vw] pt-[4.6154vw] md:pt-[2vw] px-[3.0769vw] md:px-[0.4167vw]">
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
            {/* 국문/영문 모두 모바일·PC 줄바꿈 위치가 서로 달라(2026-09-01 확인) 브레이크포인트별로 별도 렌더 */}
            {lang === "ko" ? (
              <>
                <p className="md:hidden text-[3.0769vw] font-normal leading-[1.3] text-center text-white">
                  {renderLines(bodyKoMobile)}
                </p>
                <p className="hidden md:block md:text-[0.9375vw] font-normal leading-[1.4] text-center text-white">
                  {renderLines(bodyKo)}
                </p>
              </>
            ) : (
              <>
                <p className="md:hidden text-[3.0769vw] font-light leading-[1.3] text-center text-white">
                  {renderLines(member.descEnMobile ?? member.descEn)}
                </p>
                <p className="hidden md:block md:text-[1.0417vw] font-light leading-[1.4] text-center text-white">
                  {renderLines(member.descEn)}
                </p>
              </>
            )}
            {/* 영문판은 역할 태그가 소개 문장에 통합되어 있어 별도 줄이 없음(2026-08-31 확인) */}
            {lang === "ko" && (
              <p className="text-[3.0769vw] md:text-[1.1458vw] leading-[1.3] md:leading-[1.2] tracking-[-0.05em] text-center font-bold text-white">
                {member.roleKo}
              </p>
            )}
          </div>
          {/* 사진을 실제 문서 흐름에 넣어 텍스트 블록과 8px gap(피그마 실측값, 국문/영문·모바일/PC 공통, 2026-09-01 확인)을 둠.
              절대배치+bottom 고정 방식은 텍스트가 길어지면(예: 영문 PC 3줄) 사진 머리와 겹치는 문제가 있었음(2026-09-01 확인) — 문서 흐름으로 전환해 항상 텍스트 뒤에 오도록 함.
              부모 flex 컨테이너에 이미 gap(모바일 4px/PC 8px)이 있으므로, 목표 gap(8px)에서 그만큼을 뺀 값만 margin-top으로 추가(PC는 컨테이너 gap과 목표가 같아 추가 불필요).
              폭은 부모의 좌우 padding에 영향받지 않도록 %가 아닌 vw 절대값(카드 폭 x 1.228)으로 지정.
              사진이 카드보다 커지면 shrink-0으로 줄어들지 않고 카드의 overflow-hidden에 자연히 클리핑됨 */}
          {/* QA 피드백(2026-09-04, capture/버그 리포트1_아이폰 12pro.jpg, 2_아이폰 13.jpg): 모바일에서 사진이
              카드 바닥에 안 붙고 떠 보이는 문제. 사진이 텍스트 뒤 문서 흐름에 놓여 있어 바닥 위치가 소개문
              줄 수에 좌우되는데, 여유가 6px밖에 없어서(영문 4줄 카드는 21px, 국문·영문 3줄 카드는 6px)
              iOS의 폰트 렌더링 차이로 텍스트가 조금만 짧아지면 바로 틈이 벌어졌음. 아이폰 13에서 3줄짜리
              Kim Youngwoo 카드만 뜬 것이 이 때문.
              고정 여백으로 밀어내면 여유가 없는 기기에서는 오히려 사진이 카드 밖으로 밀려나므로,
              "남는 공간이 있을 때만 그만큼 흡수"하는 mt-auto로 바닥에 고정 — 공간이 없으면 0이 되어
              기존처럼 텍스트 바로 뒤에 붙고 밀어내지 않음. PC는 여유가 18~46px로 충분해 그대로 둠 */}
          {member.photo && (
            <img
              src={member.photo}
              alt={member.nameKo}
              className="md:hidden mt-auto w-[54.158vw] max-w-none shrink-0 aspect-[462/291] object-cover"
            />
          )}
          {member.photo && (
            <img
              src={member.photo}
              alt={member.nameKo}
              className="hidden md:block w-[23.5367vw] max-w-none shrink-0 aspect-[462/291] object-cover"
            />
          )}
        </div>
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
      // md 간격은 vw라서 4K 이상 초광폭 화면에서는 1920 기준 설계값(64px)보다 계속 커져
      // 섹션 사이가 과도하게 벌어져 보였음(2026-09-02 확인) — clamp으로 1920 기준값(64px) 이상은 더 커지지 않게 고정
      className="relative w-full flex flex-col items-center gap-[12.3077vw] md:gap-[clamp(0px,3.3333vw,64px)] overflow-hidden px-[4.1026vw] md:px-[18.75vw] pt-[24.6154vw] pb-0 md:py-[6.25vw]"
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
      {/* MC 뒤 보라색 글로우(Figma 1178:610, glow) — 실제 CSS export 기준으로 교체(2026-09-02 확인):
          단순 radial-gradient 페이드로 근사했던 것을 실제 conic-gradient + blur(125px)로 교체.
          위치/크기(711px, x775 y313)는 1920 기준 vw로 환산한 기존 값(40.365vw/16.302vw/37.031vw)이 이미 정확히 일치함.
          blur 값은 이 프로젝트 컨벤션상 vw로 환산하지 않고 고정 px 유지(box-shadow/opacity 등과 동일 취급) */}
      <div
        className="hidden md:block absolute -z-10 rounded-full pointer-events-none"
        style={{
          left: "40.365vw",
          top: "16.302vw",
          width: "37.031vw",
          height: "37.031vw",
          background: "conic-gradient(from 177.09deg at 50% 50%, #3C0CB1 0deg, #B600DA 124.2deg, #A571F3 242.1deg, #3C0CB1 360deg)",
          filter: "blur(125px)",
        }}
        aria-hidden
      />

      {/* 타이틀 — 국문 모바일 스펙 확인(2026-09-01): eyebrow 16px #44a9ff, 제목 40px, 부제 #7d7d7d */}
      <div className="flex flex-col items-center gap-[4.1026vw] md:gap-[0.8333vw] w-full max-w-[1200px] text-center">
        <span className="text-[#44A9FF] md:text-[#4D94FF] font-bold uppercase tracking-[0.4103vw] md:tracking-[1.6px] text-[4.1026vw] md:text-[0.8333vw]">
          {t("cast.eyebrow")}
        </span>
        <h2
          className={`text-[10.2564vw] ${lang === "en" ? "leading-[11.2821vw]" : "leading-[8.9744vw]"} md:text-[2.9167vw] md:leading-tight font-black uppercase text-transparent bg-clip-text`}
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
            // 영문 모바일: "...Healing Mentors" / "joining...Voice" 2줄로 고정(2026-09-01 확인)
            <>
              {t("cast.desc").replace("joining the journey of Healing Voice", "").trim()}
              <br className="md:hidden" />
              <span className="md:hidden">joining the journey of Healing Voice</span>
              <span className="hidden md:inline"> joining the journey of Healing Voice</span>
            </>
          )}
        </p>
      </div>

      {/* MC */}
      {/* 데스크탑은 사진이 텍스트와 나란한 flex 요소가 아니라 절대배치로 겹쳐 있는 구조라(슬랙 실측, 2026-09-02 확인,
          node 1178:602) md:relative + md:h-[30.104vw](사진 프레임 높이와 동일)로 기준 박스를 만들어줌.
          이 높이가 순수 vw라 4K 이상에서 한도 없이 커지면서 사진·이름이 세로로 길쭉해 보이던 문제가 있어
          clamp으로 1920 기준값(578px) 이상은 더 커지지 않게 고정(2026-09-02 QA 피드백)

          4K QA 재이슈(2026-09-03, capture/4K 출연진 이미지 깨짐 현상.png): 그때 높이만 고정하고 가로 방향
          vw 값들은 그대로 둔 게 문제였음. 이 박스는 max-w-[1200px]와 높이 clamp 때문에 1920에서 크기가
          멈추는데, 안쪽 좌우 패딩·텍스트 폭·글자 크기는 순수 vw라 계속 커짐. 3840에서 실측하면 패딩
          120→240px, 텍스트 폭 363→726px으로 2배가 되면서 절대배치된 사진 프레임과 608px 겹쳐
          HOST 이름·소개 문구가 사진 뒤로 깔려 잘림. 아래 vw 값들도 모두 1920 기준값(1vw=19.2px)으로
          clamp해서 1920 이하 동작은 그대로 두고 그 위에서만 박스와 함께 멈추도록 맞춤 */}
      <div className="flex flex-col md:flex-row items-center w-full max-w-[1200px] md:relative md:h-[clamp(0px,30.104vw,578px)] gap-[6.1538vw] md:gap-[clamp(0px,1.25vw,24px)] rounded-[8.2051vw] md:rounded-[2.5vw] md:px-[clamp(0px,6.25vw,120px)]">
        {/* 모바일은 이미지 위/텍스트 아래, 데스크탑은 텍스트 좌/이미지 우(2026-08-31 모바일 스펙) */}
        {/* 영문판 설명 텍스트가 국문보다 넓어(363px, 2026-08-31 확인) 폭을 언어별로 분리 — 텍스트만 개별적으로 떠오름(사진 제외) */}
        <Reveal className={`order-2 md:order-1 flex flex-col items-center gap-[2.0513vw] md:gap-[clamp(0px,0.4167vw,8px)] ${lang === "en" ? "md:w-[clamp(0px,18.906vw,363px)]" : "md:w-[clamp(0px,14.479vw,278px)]"} shrink-0 text-center`}>
          {lang === "ko" ? (
            // "MC 장성규"도 "힐링멘토 5인"과 동일한 흰색→연보라 그라데이션(2026-09-01 재확인)
            <p
              className="text-[7.1795vw] md:text-[clamp(0px,2.0833vw,40px)] leading-none font-extrabold text-transparent bg-clip-text"
              style={{ backgroundImage: mentorsTitleGradient, fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
            >
              {t("cast.mcLabel")}
            </p>
          ) : (
            // 영문판 "Host"/"Jang Sungkyu" — 28px, gap2, Host만 그라데이션이고 이름은 흰색 단색(2026-09-01 확인)
            // gap2(=0.5128vw@390)에 md: 오버라이드가 빠져있어 PC에서 9.85px로 과도하게 벌어져 있던 것을 수정(2026-09-02 확인)
            <div className="flex flex-col items-center gap-[0.5128vw] md:gap-[clamp(0px,0.1042vw,2px)]">
              <p
                className="text-[7.1795vw] md:text-[clamp(0px,2.0833vw,40px)] leading-none font-extrabold uppercase text-transparent bg-clip-text"
                style={{ backgroundImage: titleGradient, fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
              >
                Host
              </p>
              {/* 스크린샷 확인(2026-09-01): "Jang Sungkyu"도 흰색 단색이 아니라 흰색→연보라 그라데이션 */}
              <p
                className="text-[7.1795vw] md:text-[clamp(0px,2.0833vw,40px)] leading-none font-extrabold text-transparent bg-clip-text"
                style={{ backgroundImage: mentorsTitleGradient, fontFamily: "HiKR, Paperlogy, Pretendard Variable, sans-serif" }}
              >
                {mc.nameEn}
              </p>
            </div>
          )}
          <p className={`text-[4.1026vw] md:text-[clamp(0px,1.25vw,24px)] leading-[1.4] tracking-[-0.1692vw] md:tracking-[-0.03em] ${lang === "en" ? "font-light" : "font-medium"} text-white break-keep`}>
            {renderLines(lang === "ko" ? mc.descKo : mc.descEn)}
          </p>
        </Reveal>
        {mc.photo && (
          <div className="order-1 md:hidden relative w-full max-w-[520px]">
            {/* 모바일은 사각형 사진이 아니라 가장자리가 배경으로 은은하게 페이드되는 형태(2026-09-01 스크린샷 확인) — radial mask로 처리 */}
            <img
              src={mc.photo}
              alt={mc.nameKo}
              className="w-full h-[80.2564vw] object-cover object-top"
              style={{
                maskImage: "radial-gradient(ellipse 92% 78% at 50% 40%, black 60%, transparent 98%)",
                WebkitMaskImage: "radial-gradient(ellipse 92% 78% at 50% 40%, black 60%, transparent 98%)",
              }}
            />
            {/* MC 사인("힐링보이스 장성규") — 사진 우상단 근처, Figma 좌표 환산(사진 대비 left 69%, top 20%, width 21.6%) */}
            <img
              src={mcSign}
              alt=""
              className="absolute w-[21.6%] left-[69%] top-[20%] h-auto object-contain"
            />
          </div>
        )}
        {mc.photo && (
          /* 데스크탑: 슬랙 실측 스펙(2026-09-02, node 1178:602) 기준 재구현.
             이전엔 텍스트 옆 flex-1로 "남는 폭"을 다 채우며 object-cover로 사진을 억지로 확대해서
             인물이 실제보다 훨씬 확대되어 보였음. 실제 디자인은 사진 프레임(751x578, MC 박스 기준
             left 29.833%/top 0/width 62.583%/height 100%)이 텍스트와 겹치도록 절대배치되어 있고,
             그 안의 이미지도 프레임을 꽉 채우는 게 아니라 정해진 축소 비율(약 32.3%)로 작게 배치된 뒤
             프레임 밖으로 나가는 부분만 잘리는 구조 — object-fit이 아니라 정확한 %로 재현함 */
          <div
            className="hidden md:block md:absolute overflow-hidden"
            style={{ left: "29.833%", top: "0%", width: "62.583%", height: "100%" }}
          >
            <img
              src={mc.photo}
              alt={mc.nameKo}
              className="absolute max-w-none"
              style={{ left: "18.032%", top: "1.843%", width: "68.734%", height: "134.096%" }}
            />
            {/* MC 사인 — 사진 프레임 기준 동일 비율(위 모바일과 같은 left 69%/top 20%/width 21.6%) */}
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

        {/* 데스크탑: 2장 + 3장 두 줄 / 모바일: 2열 그리드 — 카드는 각각 개별적으로 떠오르듯 등장(순차 딜레이) */}
        <div className="hidden md:flex items-center gap-[1.6667vw]">
          {row1.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.12}>
              <MentorCard member={m} lang={lang} />
            </Reveal>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-[1.6667vw]">
          {row2.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.12}>
              <MentorCard member={m} lang={lang} />
            </Reveal>
          ))}
        </div>
        {/* 모바일: 2열 그리드, 마지막 1장만 중앙 정렬(2x2+1, 2026-08-31 모바일 스펙) */}
        <div className="grid grid-cols-2 gap-x-[3.0769vw] gap-y-[8.2051vw] w-full md:hidden justify-items-center">
          {MENTOR_DATA.map((m, i) => (
            <div key={m.id} className={i === MENTOR_DATA.length - 1 ? "col-span-2" : ""}>
              <Reveal delay={(i % 2) * 0.12}>
                <MentorCard member={m} lang={lang} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
