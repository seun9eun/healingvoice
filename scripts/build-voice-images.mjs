// 보이스(Voices) 섹션 인물사진 빌드 스크립트
//
// 원본: D:/cgn-mini-project/_assets/voices_figma_original/<한글이름>.png
//   - Figma가 실제로 쓰는 파일이다. 인물마다 크기·비율이 다르다(864x1561 ~ 2336x3504).
//   - 배경 제거된 누끼 PNG, 전체 55MB. 저장소에 넣지 않는다. public/ 밖에 보관.
//   - 예전에 쓰던 voices_original(32장 전부 2336x3504)은 다른 소스였다. 쓰지 않는다.
// 출력: public/images/voices/voice_NN.webp        (564x608 = PC 카드 282x304의 2배수)
//       public/images/voices/mobile/voice_NN.webp (220x236 = 모바일 카드 110x118의 2배수)
//
// PC와 모바일이 같은 원본에 서로 다른 배치표를 쓴다(PLACEMENT / MOBILE_PLACEMENT).
// 두 표 모두 기획자가 준 공식값이고, 표의 w/h는 사진 크기가 아니라 표시 박스 크기다.
// 사진이 교체되면 배치표도 함께 다시 받아야 한다.

import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC_DIR = "D:/cgn-mini-project/_assets/voices_figma_original";
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

// 인물사진 배치값 (1x). 카드 좌상단 기준 "표시 박스"다 — dx/dy는 박스 좌상단, w/h는 박스 크기.
// 사진은 이 박스에 scaleMode대로 앉는다(FILL=cover / FIT=contain / CROP=imageTransform).
//
// [값의 출처] 기획자가 준 공식 표다(2026-09-11 답변, 국문·영문 동일). 그전에는 h가 없어서
// 렌더 스크린샷에서 역산한 값을 썼는데, h를 받으면서 걷어냈다. 원본도 Figma가 실제로 쓰는
// voices_figma_original을 쓴다 — 예전에 갖고 있던 voices_original(32장 전부 2336x3504)은
// 다른 소스였고, 그게 표가 안 맞던 원인이었다.
// 박스는 전원 h = w * 1.5.
const PLACEMENT = {
  "김성결": { dx: -41, dy: -27, w: 363, h: 545 },
  "김성신": { dx: -15, dy: -18, w: 293, h: 440 },
  "김신의": { dx: 12, dy: 12, w: 260, h: 390 },
  "김예은": { dx: 10, dy: -10, w: 253, h: 379 },
  "김하준": { dx: -1, dy: 34, w: 274, h: 411 },
  "김호준": { dx: 1, dy: 35, w: 279, h: 418 },
  "나시온": { dx: 0, dy: 12, w: 282, h: 423 },
  "라이야": { dx: -21, dy: 13, w: 303, h: 454 },
  "림팍": { dx: 18, dy: 12, w: 254, h: 381 },
  "멜로디": { dx: -30, dy: 33, w: 340, h: 510 },
  "문은수": { dx: 50, dy: 35, w: 214, h: 320 },
  "박연홍": { dx: 0, dy: -6, w: 263, h: 395 },
  "박예음": { dx: 15, dy: 32, w: 236, h: 354 },
  "석상은": { dx: -6, dy: 20, w: 283, h: 425 },
  "아삽": { dx: -89, dy: -44, w: 472, h: 707 },
  "예잔": { dx: 7, dy: 33, w: 261, h: 392 },
  "유난이": { dx: 13, dy: 32, w: 257, h: 385 },
  "이철규": { dx: 0, dy: 0, w: 272, h: 408 },
  "임보민": { dx: -9, dy: -22, w: 299, h: 449 },
  "임성규": { dx: 10, dy: 13, w: 264, h: 397 },
  "장근희": { dx: -35, dy: 0, w: 336, h: 504 },
  "전기수": { dx: -13, dy: 9, w: 287, h: 430 },
  "전덕호": { dx: -5, dy: 0, w: 287, h: 430 },
  "정지훈": { dx: -14, dy: -9, w: 296, h: 444 },
  "조수아": { dx: -12, dy: 9, w: 288, h: 432 },
  "지은혜": { dx: 17, dy: 13, w: 247, h: 371 },
  "초롬": { dx: -6, dy: 0, w: 294, h: 442 },
  "최서희": { dx: 3, dy: 0, w: 269, h: 404 },
  "케지아": { dx: 8, dy: 8, w: 251, h: 377 },
  "키디비": { dx: 1, dy: 30, w: 280, h: 420 },
  "피터": { dx: -8, dy: 7, w: 307, h: 461 },
  "호림": { dx: -7, dy: -10, w: 295, h: 443 },
};

// 모바일 카드 (Figma 1847:5250) — 카드 110x118, 3열. PC보다 크게 확대해 얼굴 위주로 잡힌다.
//
// PC와 달리 Figma가 실제로 쓰는 원본(voices_figma_original)과 기획자 배치표를 그대로 쓴다.
// 배치표만으로는 맞지 않았던 이유는 표가 아니라 원본이 달랐기 때문이다 — 우리가 갖고 있던
// voices_original은 32장 전부 2336x3504인데 Figma 쪽은 인물마다 크기·비율이 다르다.
// 원본을 받고 나니 표가 그대로 맞는다.
//
// dx/dy/w/h는 카드 좌상단 기준 "표시 박스"다. 사진은 이 박스에 scaleMode대로 앉는다
// (FILL=cover, FIT=contain, CROP=imageTransform). 박스는 전원 h = w * 1.5.
const MOBILE_OUT_DIR = "public/images/voices/mobile";
const MOBILE_CARD_W = 110;
const MOBILE_CARD_H = 118;
const MOBILE_PLACEMENT = {
  "김성결": { dx: -21.07, dy: -10.88, w: 151.39, h: 227.08 },
  "김성신": { dx: -9.07, dy: -7.13, w: 122.22, h: 183.33 },
  "김신의": { dx: 1.0, dy: 5.37, w: 108.33, h: 162.5 },
  "김예은": { dx: 2.07, dy: -3.8, w: 105.28, h: 157.92 },
  "김하준": { dx: -2.0, dy: 14.07, w: 114.17, h: 171.25 },
  "김호준": { dx: -2.93, dy: 12.49, w: 116.11, h: 174.17 },
  "나시온": { dx: -4.0, dy: 4.91, w: 117.5, h: 176.25 },
  "라이야": { dx: -9.93, dy: 1.32, w: 126.11, h: 189.17 },
  "림팍": { dx: 3.5, dy: 3.44, w: 105.83, h: 158.75 },
  "멜로디": { dx: -16.0, dy: 13.19, w: 141.67, h: 212.5 },
  "문은수": { dx: 18.14, dy: 14.02, w: 88.89, h: 133.33 },
  "박연홍": { dx: -0.5, dy: -3.06, w: 109.72, h: 164.58 },
  "박예음": { dx: 4.0, dy: 13.32, w: 98.33, h: 147.5 },
  "석상은": { dx: -4.07, dy: 8.32, w: 118.06, h: 177.08 },
  "아삽": { dx: -42.86, dy: -22.36, w: 196.39, h: 294.58 },
  "예잔": { dx: -0.07, dy: 12.73, w: 108.89, h: 163.33 },
  "유난이": { dx: 4.07, dy: 13.85, w: 106.94, h: 160.42 },
  "이철규": { dx: -7.0, dy: -2.48, w: 113.33, h: 170.0 },
  "임보민": { dx: -7.07, dy: -14.65, w: 124.72, h: 187.08 },
  "임성규": { dx: 1.86, dy: 3.93, w: 110.28, h: 165.42 },
  "장근희": { dx: -16.0, dy: -0.95, w: 140.0, h: 210.0 },
  "전기수": { dx: -9.93, dy: 0.8, w: 119.44, h: 179.17 },
  "전덕호": { dx: -4.93, dy: -1.95, w: 119.44, h: 179.17 },
  "정지훈": { dx: -7.0, dy: -3.7, w: 123.33, h: 185.0 },
  "조수아": { dx: -5.0, dy: 3.34, w: 120.0, h: 180.0 },
  "지은혜": { dx: 3.93, dy: 5.0, w: 103.06, h: 154.58 },
  "초롬": { dx: -6.14, dy: -0.41, w: 122.78, h: 184.17 },
  "최서희": { dx: -1.07, dy: -0.41, w: 112.22, h: 168.33 },
  "케지아": { dx: 3.34, dy: 3.45, w: 104.72, h: 157.08 },
  "키디비": { dx: -0.09, dy: 12.62, w: 116.67, h: 175.0 },
  "피터": { dx: -9.07, dy: 3.04, w: 128.06, h: 192.08 },
  "호림": { dx: -6.07, dy: -4.05, w: 123.06, h: 184.58 },
};

// fill의 scaleMode. 값이 없으면 FILL. CROP 2명은 imageTransform([[a,b,tx],[c,d,ty]])까지 온다.
// 이 행렬은 박스 좌표(0~1)를 이미지 좌표(0~1)로 보내므로, 뒤집으면 이미지가 박스 안에서
// 차지하는 크기·오프셋이 나온다: 폭 = w/a, 높이 = h/d, 오프셋 = (-tx/a * w, -ty/d * h).
const SCALE_MODE = {
  "나시온": { mode: "CROP", t: [[1, 0, 0], [0, 0.9481669, -0.040255]] },
  "호림": { mode: "CROP", t: [[0.9988713, 0, 0.0023187], [0, 1, 0.0416932]] },
  "멜로디": { mode: "FIT" }, "석상은": { mode: "FIT" }, "예잔": { mode: "FIT" },
  "유난이": { mode: "FIT" }, "지은혜": { mode: "FIT" }, "키디비": { mode: "FIT" },
};

// 표시 박스 안에서 사진이 실제로 그려질 위치·크기(1x, 카드 좌상단 기준).
function fitPhoto(p, srcW, srcH, name) {
  const m = SCALE_MODE[name];
  if (m?.mode === "CROP") {
    const [[a, , tx], [, d, ty]] = m.t;
    return { w: p.w / a, h: p.h / d, x: p.dx - (tx / a) * p.w, y: p.dy - (ty / d) * p.h };
  }
  const pick = m?.mode === "FIT" ? Math.min : Math.max; // FIT=contain, FILL=cover
  const s = pick(p.w / srcW, p.h / srcH);
  const w = srcW * s, h = srcH * s;
  return { w, h, x: p.dx + (p.w - w) / 2, y: p.dy + (p.h - h) / 2 }; // 박스 중앙 정렬
}

async function build(cfg = {}) {
  const srcDir = cfg.srcDir ?? SRC_DIR;
  const outDir = cfg.outDir ?? OUT_DIR;
  const cardW = cfg.cardW ?? CARD_W;
  const cardH = cfg.cardH ?? CARD_H;
  const placement = cfg.placement ?? PLACEMENT;
  fs.mkdirSync(outDir, { recursive: true });
  const outW = cardW * SCALE;
  const outH = cardH * SCALE;
  const rows = [];

  for (let i = 0; i < ORDER.length; i++) {
    const name = ORDER[i];
    const file = path.join(srcDir, name + ".png");
    if (!fs.existsSync(file)) { console.log(`  누락: ${name}`); continue; }

    const p = placement[name];
    if (!p) { console.log(`  배치값 없음: ${name}`); continue; }

    // 배치값에 h가 있으면 그건 "표시 박스"라 scaleMode대로 앉힌다(모바일).
    // 없으면 예전 방식 — 종횡비 1.5로 늘려 채운다(PC, voices_original 기준으로 역산한 값).
    let g;
    if (p.h != null) {
      const meta = await sharp(file).metadata();
      g = fitPhoto(p, meta.width, meta.height, name);
    } else {
      g = { x: p.dx, y: p.dy, w: p.w, h: p.w * 1.5 };
    }
    const dispW = Math.round(g.w * SCALE);
    const dispH = Math.round(g.h * SCALE);

    const photo = await sharp(file).resize({ width: dispW, height: dispH, fit: "fill" }).png().toBuffer();

    // 카드 크기 캔버스에 오프셋만큼 앉힌다. 캔버스 밖으로 나가는 부분은 잘라야 하므로,
    // 큰 캔버스에 합성한 뒤 카드 영역만 잘라낸다(sharp의 composite는 음수 top/left를 못 받음).
    const padX = Math.max(0, Math.ceil(-g.x * SCALE));
    const padY = Math.max(0, Math.ceil(-g.y * SCALE));
    const bigW = padX + outW + dispW;
    const bigH = padY + outH + dispH;

    const big = await sharp({
      create: { width: bigW, height: bigH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([{ input: photo, left: Math.round(padX + g.x * SCALE), top: Math.round(padY + g.y * SCALE) }])
      .png()
      .toBuffer();

    const num = String(i + 1).padStart(2, "0");
    const outFile = path.join(outDir, `voice_${num}.webp`);
    await sharp(big)
      .extract({ left: padX, top: padY, width: outW, height: outH })
      .webp({ quality: 82, alphaQuality: 90 })
      .toFile(outFile);

    const kb = (fs.statSync(outFile).size / 1024).toFixed(0);
    rows.push({ num, name, w: Math.round(g.w), dx: Math.round(g.x), dy: Math.round(g.y), kb });
  }

  console.log("번호 이름     표시폭  dx    dy    용량");
  rows.forEach((r) =>
    console.log(
      `${r.num}  ${r.name.padEnd(6)} ${String(r.w).padStart(5)} ${String(r.dx).padStart(5)} ${String(r.dy).padStart(5)}  ${r.kb}KB`
    )
  );
  const total = rows.reduce((a, r) => a + Number(r.kb), 0);
  console.log(`\n${rows.length}장, 합계 ${(total / 1024).toFixed(1)}MB`);
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
