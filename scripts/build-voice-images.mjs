// 보이스(Voices) 섹션 인물사진 빌드 스크립트
//
// 원본: D:/cgn-mini-project/_assets/voices_original/<한글이름>.png
//   - 2336x3504(3:2 세로), 배경 제거된 누끼 PNG, 장당 5~15MB (전체 265MB)
//   - 이 원본은 저장소에 넣지 않는다. public/ 밖에 보관.
// 출력: public/images/voices/voice_NN.webp (564x608 = 카드 282x304의 2배수, 알파 유지)
//
// 배치값은 PLACEMENT 표에 32명 전원이 들어 있다. 값의 출처와 검증 방법은 그 표 위 주석 참고.
// 원본 사진이 교체되면 배치값도 다시 뽑아야 한다.

import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC_DIR = "D:/cgn-mini-project/_assets/voices_original";
const OUT_DIR = "public/images/voices";

const CARD_W = 282; // 1x 카드 크기 (Figma)
const CARD_H = 304;
const SCALE = 2; // 출력 배수 — 화면에 282x304로 그려지므로 2배수면 충분

// Figma 노출 순서 (좌→우, 위→아래). 파일명 번호도 이 순서를 따른다.
const ORDER = [
  "김성결", "김성신", "김신의", "김예은",
  "김하준", "김호준", "나시온", "라이야",
  "림팍", "멜로디", "문은수", "박연홍",
  "박예음", "석상은", "아삽", "예잔",
  "유난이", "이철규", "임보민", "임성규",
  "장근희", "전기수", "전덕호", "정지훈",
  "조수아", "지은혜", "초롬", "최서희",
  "케지아", "키디비", "피터", "호림",
];

// 인물사진 배치값 (1x). dx/dy는 카드 좌상단 기준 사진 좌상단 오프셋, w는 사진 표시 폭.
//
// [값의 출처] 처음엔 Figma 좌표를 그대로 받아 썼는데, 2~8행 값이 실제 렌더와 맞지 않았다.
// 그 값대로 그리면 인물이 카드보다 작고 아래로 내려가, Figma에서 카드에 꽉 차 보이는 것과 달랐다.
// 그래서 좌표 대신 "섹션 렌더 PNG 자체"를 정답으로 두고 배치값을 역산했다(scripts/_fit_tmp.mjs,
// 반영 후 삭제). 카드 배경 + 사진 + 하단 그라디언트를 후보 배치로 합성해 렌더와 픽셀 차이가
// 가장 작은 조합을 찾는 방식이다.
//
// 이 방법의 검증: 1행 4명은 Figma 실측값을 이미 알고 있었는데(김성결 -41/-27/363 등),
// 역산 결과가 -42/-28/362처럼 1~3px 안으로 일치했다. 같은 방법으로 얻은 2~8행도 신뢰할 만하다.
// 원본 사진이 교체되면 값이 달라지므로 그때는 역산을 다시 돌려야 한다.
const PLACEMENT = {
  // 1행
  "김성결": { dx: -42, dy: -28, w: 362 },
  "김성신": { dx: -17, dy: -21, w: 294 },
  "김신의": { dx: 12, dy: 11, w: 258 },
  "김예은": { dx: 9, dy: -11, w: 252 },
  // 2행
  "김하준": { dx: -19, dy: -17, w: 310 },
  "김호준": { dx: -24, dy: -10, w: 312 },
  "나시온": { dx: -18, dy: -18, w: 326 },
  "라이야": { dx: -36, dy: 0, w: 326 },
  // 3행
  "림팍": { dx: 16, dy: 10, w: 254 },
  "멜로디": { dx: -47, dy: -30, w: 380 },
  "문은수": { dx: 34, dy: 8, w: 232 },
  "박연홍": { dx: -2, dy: -9, w: 264 },
  // 4행
  "박예음": { dx: 0, dy: -1, w: 256 },
  "석상은": { dx: -20, dy: -11, w: 296 },
  "아삽": { dx: -126, dy: -69, w: 536 },
  "예잔": { dx: -4, dy: -1, w: 282 },
  // 5행
  "유난이": { dx: -13, dy: -15, w: 290 },
  "이철규": { dx: -4, dy: -3, w: 276 },
  "임보민": { dx: -16, dy: -29, w: 308 },
  "임성규": { dx: 10, dy: 13, w: 262 },
  // 6행
  "장근희": { dx: -37, dy: -2, w: 336 },
  "전기수": { dx: -16, dy: 7, w: 290 },
  "전덕호": { dx: -11, dy: -5, w: 296 },
  "정지훈": { dx: -15, dy: -11, w: 296 },
  // 7행
  "조수아": { dx: -12, dy: 8, w: 286 },
  "지은혜": { dx: 16, dy: 1, w: 246 },
  "초롬": { dx: -7, dy: -1, w: 292 },
  "최서희": { dx: 2, dy: -2, w: 268 },
  // 8행
  "케지아": { dx: 6, dy: 6, w: 252 },
  "키디비": { dx: -15, dy: -5, w: 302 },
  "피터": { dx: -11, dy: 3, w: 310 },
  "호림": { dx: -9, dy: -31, w: 296 },
};

// 모바일 카드 (Figma 1821:571, 2026-09-10 답변) — 카드 110x118, 3열.
// 같은 원본을 쓰지만 PC보다 크게 확대해 얼굴 위주로 잡힌다(김성결 기준 PC 362 → 모바일 151).
// 답변 표에는 h도 있었지만 전부 w*1.5라 생략했다(build가 같은 식으로 계산한다).
const MOBILE_OUT_DIR = "public/images/voices/mobile";
const MOBILE_CARD_W = 110;
const MOBILE_CARD_H = 118;
const MOBILE_PLACEMENT = {
  "김성결": { dx: -21.07, dy: -10.88, w: 151.39 },
  "김성신": { dx: -9.07, dy: -7.13, w: 122.22 },
  "김신의": { dx: 1.0, dy: 5.37, w: 108.33 },
  "김예은": { dx: 2.07, dy: -3.8, w: 105.28 },
  "김하준": { dx: -2.0, dy: 14.07, w: 114.17 },
  "김호준": { dx: -2.93, dy: 12.49, w: 116.11 },
  "나시온": { dx: -4.0, dy: 4.91, w: 117.5 },
  "라이야": { dx: -9.93, dy: 1.32, w: 126.11 },
  "림팍": { dx: 3.5, dy: 3.44, w: 105.83 },
  "멜로디": { dx: -16.0, dy: 13.19, w: 141.67 },
  "문은수": { dx: 18.14, dy: 14.02, w: 88.89 },
  "박연홍": { dx: -0.5, dy: -3.06, w: 109.72 },
  "박예음": { dx: 4.0, dy: 13.32, w: 98.33 },
  "석상은": { dx: -4.07, dy: 8.32, w: 118.06 },
  "아삽": { dx: -42.86, dy: -22.36, w: 196.39 },
  "예잔": { dx: -0.07, dy: 12.73, w: 108.89 },
  "유난이": { dx: 4.07, dy: 13.85, w: 106.94 },
  "이철규": { dx: -7.0, dy: -2.48, w: 113.33 },
  "임보민": { dx: -7.07, dy: -14.65, w: 124.72 },
  "임성규": { dx: 1.86, dy: 3.93, w: 110.28 },
  "장근희": { dx: -16.0, dy: -0.95, w: 140.0 },
  "전기수": { dx: -9.93, dy: 0.8, w: 119.44 },
  "전덕호": { dx: -4.93, dy: -1.95, w: 119.44 },
  "정지훈": { dx: -7.0, dy: -3.7, w: 123.33 },
  "조수아": { dx: -5.0, dy: 3.34, w: 120.0 },
  "지은혜": { dx: 3.93, dy: 5.0, w: 103.06 },
  "초롬": { dx: -6.14, dy: -0.41, w: 122.78 },
  "최서희": { dx: -1.07, dy: -0.41, w: 112.22 },
  "케지아": { dx: 3.34, dy: 3.45, w: 104.72 },
  "키디비": { dx: -0.09, dy: 12.62, w: 116.67 },
  "피터": { dx: -9.07, dy: 3.04, w: 128.06 },
  "호림": { dx: -6.07, dy: -4.05, w: 123.06 },
};

async function build(cfg = { outDir: OUT_DIR, cardW: CARD_W, cardH: CARD_H, placement: PLACEMENT }) {
  const { outDir: OUT_DIR, cardW: CARD_W, cardH: CARD_H, placement: PLACEMENT } = cfg;
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outW = CARD_W * SCALE;
  const outH = CARD_H * SCALE;
  const rows = [];

  for (let i = 0; i < ORDER.length; i++) {
    const name = ORDER[i];
    const file = path.join(SRC_DIR, name + ".png");
    if (!fs.existsSync(file)) { console.log(`  누락: ${name}`); continue; }

    const p = PLACEMENT[name];
    if (!p) { console.log(`  배치값 없음: ${name}`); continue; }
    const dispW = Math.round(p.w * SCALE);
    const dispH = Math.round(dispW * 1.5);

    const photo = await sharp(file).resize({ width: dispW, height: dispH, fit: "fill" }).png().toBuffer();

    // 카드 크기 캔버스에 오프셋만큼 앉힌다. 캔버스 밖으로 나가는 부분은 잘라야 하므로,
    // 큰 캔버스에 합성한 뒤 카드 영역만 잘라낸다(sharp의 composite는 음수 top/left를 못 받음).
    const padX = Math.max(0, Math.ceil(-p.dx * SCALE));
    const padY = Math.max(0, Math.ceil(-p.dy * SCALE));
    const bigW = padX + outW + dispW;
    const bigH = padY + outH + dispH;

    const big = await sharp({
      create: { width: bigW, height: bigH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([{ input: photo, left: Math.round(padX + p.dx * SCALE), top: Math.round(padY + p.dy * SCALE) }])
      .png()
      .toBuffer();

    const num = String(i + 1).padStart(2, "0");
    const outFile = path.join(OUT_DIR, `voice_${num}.webp`);
    await sharp(big)
      .extract({ left: padX, top: padY, width: outW, height: outH })
      .webp({ quality: 82, alphaQuality: 90 })
      .toFile(outFile);

    const kb = (fs.statSync(outFile).size / 1024).toFixed(0);
    rows.push({ num, name, w: p.w, dx: p.dx, dy: p.dy, kb });
  }

  console.log("번호 이름     표시폭  dx    dy    용량");
  rows.forEach((r) =>
    console.log(
      `${r.num}  ${r.name.padEnd(6)} ${String(r.w).padStart(5)} ${String(r.dx).padStart(5)} ${String(r.dy).padStart(5)}  ${r.kb}KB`
    )
  );
  const total = rows.reduce((a, r) => a + Number(r.kb), 0);
  console.log(`\n${rows.length}장, 합계 ${(total / 1024).toFixed(1)}MB (원본 265MB)`);
  return rows;
}

// 결과를 8행x4열로 붙여 Figma 스크린샷과 대조할 수 있는 시트를 만든다.
async function sheet(outPath) {
  const cw = CARD_W, chh = CARD_H, gap = 12;
  const cols = 4, rowsN = 8;
  const W = cols * cw + (cols + 1) * gap;
  const H = rowsN * chh + (rowsN + 1) * gap;
  const layers = [];

  for (let i = 0; i < ORDER.length; i++) {
    const f = path.join(OUT_DIR, `voice_${String(i + 1).padStart(2, "0")}.webp`);
    if (!fs.existsSync(f)) continue;
    const buf = await sharp(f).resize({ width: cw, height: chh }).png().toBuffer();
    layers.push({
      input: buf,
      left: gap + (i % cols) * (cw + gap),
      top: gap + Math.floor(i / cols) * (chh + gap),
    });
  }

  await sharp({ create: { width: W, height: H, channels: 4, background: { r: 10, g: 26, b: 74, alpha: 1 } } })
    .composite(layers)
    .png()
    .toFile(outPath);
  console.log(`대조 시트: ${outPath} (${W}x${H})`);
}

// ── 모달용 ───────────────────────────────────────────────────────────────
//
// 원본: D:/cgn-mini-project/_assets/voices_modal_original/<한글이름>.png
//   - 1168x1752, 배경 제거된 누끼 PNG. 카드용과는 다른 컷이다(카드=손 모은 포즈, 모달=턱 괴는 포즈).
//   - 같은 폴더의 _modal_bg.png는 인물 뒤에 깔리는 파란 배경. Figma에서도 별도 레이어라 합성하지 않는다.
// 출력: public/images/voices/modal/voice_NN.webp (586x880 = 모달 인물 293x440의 2배수) + bg.webp
//
// 카드용과 달리 배치 보정(PLACEMENT)이 없다. 원본이 이미 모달 구도로 와서 크기만 줄이면 된다.
const MODAL_SRC = "D:/cgn-mini-project/_assets/voices_modal_original";
const MODAL_OUT = "public/images/voices/modal";
const MODAL_W = 293 * SCALE; // 586 — 모달 인물 표시 폭 293의 2배수

async function buildModal() {
  fs.mkdirSync(MODAL_OUT, { recursive: true });
  const rows = [];

  for (let i = 0; i < ORDER.length; i++) {
    const name = ORDER[i];
    const file = path.join(MODAL_SRC, name + ".png");
    if (!fs.existsSync(file)) { console.log(`  누락: ${name}`); continue; }

    const num = String(i + 1).padStart(2, "0");
    const outFile = path.join(MODAL_OUT, `voice_${num}.webp`);
    // 폭만 지정해 원본 비율을 유지한다(1168x1752 -> 586x879). 293x440 박스와 0.1% 차이라
    // 늘려 맞추지 않는다 — 억지로 fill하면 인물이 미세하게 일그러진다.
    const info = await sharp(file)
      .resize({ width: MODAL_W })
      .webp({ quality: 85, alphaQuality: 90 })
      .toFile(outFile);

    rows.push({ num, name, w: info.width, h: info.height, kb: (fs.statSync(outFile).size / 1024).toFixed(0) });
  }

  // 배경은 PC와 모바일이 서로 다른 파일이다(디자인에서 3배수로 따로 내려받음, 2026-09-10).
  // 표시 크기가 크게 다르므로(PC 1192x1106 / 모바일 608x564) 한 장을 공유하지 않는다.
  // 원본은 크기를 줄이지 않고 포맷만 바꾼다 — 3배수로 받은 것을 줄이면 다시 모자라진다.
  // 확장자는 받는 대로 달라질 수 있어 이름 앞부분만 맞으면 집는다.
  const files = fs.readdirSync(MODAL_SRC);
  for (const [stem, out] of [["modal_bg_MO", "bg_mo.webp"], ["modal_bg_PC", "bg_pc.webp"]]) {
    const found = files.find((f) => new RegExp(`^${stem}\\.(png|jpe?g|webp)$`, "i").test(f));
    if (!found) { console.log(`  배경 누락: ${stem}.* (${MODAL_SRC})`); continue; }
    const bgOut = path.join(MODAL_OUT, out);
    const bg = await sharp(path.join(MODAL_SRC, found)).webp({ quality: 85 }).toFile(bgOut);
    console.log(`배경  ${out}  ${bg.width}x${bg.height}  ${(fs.statSync(bgOut).size / 1024).toFixed(0)}KB`);
  }

  console.log("\n번호 이름      크기        용량");
  rows.forEach((r) => console.log(`${r.num}  ${r.name.padEnd(6)} ${`${r.w}x${r.h}`.padStart(9)}  ${r.kb}KB`));
  const total = rows.reduce((a, r) => a + Number(r.kb), 0);
  console.log(`\n${rows.length}장, 합계 ${(total / 1024).toFixed(1)}MB`);
  return rows;
}

if (process.argv.includes("--modal")) {
  await buildModal();
} else if (process.argv.includes("--mobile")) {
  await build({
    outDir: MOBILE_OUT_DIR,
    cardW: MOBILE_CARD_W,
    cardH: MOBILE_CARD_H,
    placement: MOBILE_PLACEMENT,
  });
} else {
  const rows = await build();
  const sheetPath = process.argv[2];
  if (sheetPath) await sheet(sheetPath);
}
