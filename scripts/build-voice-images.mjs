// 보이스(Voices) 섹션 인물사진 빌드 스크립트
//
// 원본: D:/cgn-mini-project/_assets/voices_original/<한글이름>.png
//   - 2336x3504(3:2 세로), 배경 제거된 누끼 PNG, 장당 5~15MB (전체 265MB)
//   - 이 원본은 저장소에 넣지 않는다. public/ 밖에 보관.
// 출력: public/images/voices/voice_NN.webp (564x608 = 카드 282x304의 2배수, 알파 유지)
//
// [배치 규칙 — Figma 1행 4장의 실측값을 역산해서 얻음]
// 디자이너는 카드마다 사진을 다른 크기로 앉혔는데, 무작위가 아니라 아래 규칙을 따르고 있었다.
//   1) 머리 꼭대기를 카드 상단에서 28.6px(1x 기준) 지점에 맞춘다 — 4장 모두 28.1~29.2로 사실상 동일
//   2) 머리 중심을 카드 가로 중앙(141px)에 둔다 — 130.9~144.3, 대체로 중앙
//   3) 머리 높이가 카드 안에서 비슷해 보이도록(약 128px) 사진 전체를 확대/축소한다
//      → 원본에서 머리가 크게 찍힌 사람일수록 사진을 작게 앉힌다
// 그 결과 카드에는 가슴 위쪽만 보이고, 사진의 나머지(하반신)는 카드 밖으로 나가 마스크에 잘린다.
//
// PLACEMENT에 Figma 실측값이 있으면 그 값을 그대로 쓰고, 없으면 위 규칙으로 자동 계산한다.
// 자동 계산은 머리 높이를 알파 채널의 가로폭 프로파일(머리→목에서 좁아지는 지점)로 추정하는데,
// 긴 머리처럼 머리카락이 어깨까지 내려오면 목이 안 잡혀서 값이 튄다. 그래서 최종 결과는 반드시
// 대조 시트(--sheet)로 확인하고, 어긋나는 사람은 Figma 실측값을 받아 PLACEMENT에 채워 넣을 것.

import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC_DIR = "D:/cgn-mini-project/_assets/voices_original";
const OUT_DIR = "public/images/voices";

const CARD_W = 282; // 1x 카드 크기 (Figma)
const CARD_H = 304;
const SCALE = 2; // 출력 배수 — 화면에 282x304로 그려지므로 2배수면 충분

// 배치 규칙 상수 (1x, 카드 좌상단 원점 기준)
const HEAD_TOP = 28.6; // 머리 꼭대기 y
const HEAD_CENTER_X = 141; // 머리 중심 x (카드 정중앙)
const HEAD_HEIGHT = 128; // 머리 높이(꼭대기~목)

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

// Figma 실측 배치값 (1x). dx/dy는 카드 좌상단 기준 사진 좌상단 오프셋, w는 사진 표시 폭.
// 32명 전원 확인 완료(2026-09-09 Figma 답변). 원 답변은 섹션 프레임 절대좌표로 왔고,
// 카드 원점(행 y: 409/777/1145/1513/1881/2249/2617/2985, 열 x: 360/666/972/1278)을 빼서 옮겼다.
// 아래 값이 있으면 추정 로직을 타지 않으므로, 지금은 32명 전부 실측값으로 그려진다.
const PLACEMENT = {
  // 1행
  "김성결": { dx: -41, dy: -27, w: 363 },
  "김성신": { dx: -15, dy: -18, w: 293 },
  "김신의": { dx: 12, dy: 12, w: 260 },
  "김예은": { dx: 10, dy: -10, w: 253 },
  // 2행
  "김하준": { dx: -1, dy: 34, w: 274 },
  "김호준": { dx: 1, dy: 35, w: 279 },
  "나시온": { dx: 0, dy: 12, w: 282 },
  "라이야": { dx: -21, dy: 13, w: 303 },
  // 3행
  "림팍": { dx: 18, dy: 12, w: 254 },
  "멜로디": { dx: -30, dy: 33, w: 340 },
  "문은수": { dx: 50, dy: 35, w: 214 },
  "박연홍": { dx: 0, dy: -6, w: 263 },
  // 4행
  "박예음": { dx: 15, dy: 32, w: 236 },
  "석상은": { dx: -6, dy: 20, w: 283 },
  "아삽": { dx: -89, dy: -44, w: 472 },
  "예잔": { dx: 7, dy: 33, w: 261 },
  // 5행
  "유난이": { dx: 13, dy: 32, w: 257 },
  "이철규": { dx: 0, dy: 0, w: 272 },
  "임보민": { dx: -9, dy: -22, w: 299 },
  "임성규": { dx: 10, dy: 13, w: 264 },
  // 6행
  "장근희": { dx: -35, dy: 0, w: 336 },
  "전기수": { dx: -13, dy: 9, w: 287 },
  "전덕호": { dx: -5, dy: 0, w: 287 },
  "정지훈": { dx: -14, dy: -9, w: 296 },
  // 7행
  "조수아": { dx: -12, dy: 9, w: 288 },
  "지은혜": { dx: 17, dy: 13, w: 247 },
  "초롬": { dx: -6, dy: 0, w: 294 },
  "최서희": { dx: 3, dy: 0, w: 269 },
  // 8행
  "케지아": { dx: 8, dy: 8, w: 251 },
  "키디비": { dx: 1, dy: 30, w: 280 },
  "피터": { dx: -8, dy: 7, w: 307 },
  "호림": { dx: -7, dy: -10, w: 295 },
};

// 자동 계산 결과를 Figma 렌더와 대조해 보고 눈에 띄게 어긋난 사람만 손으로 보정한다.
// 값은 확대 배율(1보다 크면 더 크게 앉힌다). 머리 꼭대기 위치와 가로 중앙 정렬은 그대로 유지된다.
// 지금은 32명 전원이 PLACEMENT 실측값을 쓰므로 비어 있다. 새 인물이 추가돼 자동 계산을 타는
// 경우에만 필요해진다.
const SCALE_FIX = {};

const ANALYZE_W = 292; // 알파 분석용 축소 폭 (원본 그대로 훑으면 느림)

// 알파 채널에서 피사체의 머리 꼭대기 y, 머리 높이, 머리 중심 x를 추정한다.
async function measure(file) {
  const { data, info } = await sharp(file)
    .resize({ width: ANALYZE_W })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h, channels: ch } = info;
  const rowW = new Array(h).fill(0);
  const rowL = new Array(h).fill(-1);
  const rowR = new Array(h).fill(-1);
  let top = -1;

  for (let y = 0; y < h; y++) {
    let l = -1, r = -1, c = 0;
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * ch + 3] > 40) {
        c++;
        if (l < 0) l = x;
        r = x;
      }
    }
    rowW[y] = c; rowL[y] = l; rowR[y] = r;
    if (c > 2 && top < 0) top = y;
  }

  // 머리 끝(목)을 찾는다. 가로폭 프로파일은 [머리에서 증가 → 목에서 감소 → 어깨에서 다시 증가]
  // 형태라, 위에서 내려오며 "처음" 꺾이는 지점을 머리 최대폭으로, 그 아래 첫 국소최소를 목으로 본다.
  // 고정 구간에서 최대값을 찾으면 전신샷인 사람은 어깨를 머리로 오인하므로 이렇게 처리한다.
  const sm = new Array(h).fill(0);
  for (let y = 0; y < h; y++) {
    let s = 0, c = 0;
    for (let j = -4; j <= 4; j++) { const t = y + j; if (t >= 0 && t < h) { s += rowW[t]; c++; } }
    sm[y] = s / c;
  }
  let headMaxY = top, headMaxW = 0;
  for (let y = top; y < h; y++) {
    if (sm[y] > headMaxW) { headMaxW = sm[y]; headMaxY = y; }
    else if (sm[y] < headMaxW * 0.93 && y - headMaxY > 4) break;
  }
  let neck = headMaxY, minW = sm[headMaxY];
  for (let y = headMaxY; y < h; y++) {
    if (sm[y] < minW) { minW = sm[y]; neck = y; }
    else if (sm[y] > minW * 1.08 && y - neck > 4) break;
  }

  const centers = [];
  for (let y = top; y < neck; y++) if (rowL[y] >= 0) centers.push((rowL[y] + rowR[y]) / 2);
  centers.sort((a, b) => a - b);
  const headCx = centers[Math.floor(centers.length / 2)] ?? w / 2;

  return {
    topFrac: top / h,          // 이미지 높이 대비 머리 꼭대기 위치
    headFrac: (neck - top) / h, // 이미지 높이 대비 머리 높이
    cxFrac: headCx / w,         // 이미지 폭 대비 머리 중심
  };
}

// 배치값(dx, dy, w)을 구한다. Figma 실측값이 있으면 그대로, 없으면 규칙으로 계산.
// 머리 높이 추정이 신뢰할 만한 범위. 긴 머리처럼 목이 안 잡히는 사람은 이 범위를 크게 벗어나므로,
// 벗어나면 나머지 인원의 중앙값으로 대체하고 "estimate"로 표시한다(= Figma 실측값 필요).
const FRAC_MIN = 0.14;
const FRAC_MAX = 0.40;

async function placementFor(name, file, fallbackFrac) {
  if (PLACEMENT[name]) return { ...PLACEMENT[name], source: "figma" };

  const m = await measure(file);
  const ok = m.headFrac >= FRAC_MIN && m.headFrac <= FRAC_MAX;
  const frac = ok ? m.headFrac : fallbackFrac;
  const dispH = (HEAD_HEIGHT / frac) * (SCALE_FIX[name] ?? 1); // 머리 높이가 HEAD_HEIGHT가 되도록 전체 높이 결정
  const dispW = dispH / 1.5;              // 원본 비율 3:2 (세로)
  return {
    dx: HEAD_CENTER_X - m.cxFrac * dispW,
    dy: HEAD_TOP - m.topFrac * dispH,
    w: dispW,
    source: ok ? "auto" : "estimate",
  };
}

async function build() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outW = CARD_W * SCALE;
  const outH = CARD_H * SCALE;
  const rows = [];

  // 1차 측정: 신뢰 가능한 머리 높이 비율만 모아 중앙값을 구한다(추정 실패자의 대체값).
  const fracs = [];
  for (const name of ORDER) {
    if (PLACEMENT[name]) continue;
    const file = path.join(SRC_DIR, name + ".png");
    if (!fs.existsSync(file)) continue;
    const m = await measure(file);
    if (m.headFrac >= FRAC_MIN && m.headFrac <= FRAC_MAX) fracs.push(m.headFrac);
  }
  fracs.sort((a, b) => a - b);
  const fallbackFrac = fracs[Math.floor(fracs.length / 2)] ?? 0.29;
  console.log(`머리높이 비율 중앙값 ${fallbackFrac.toFixed(3)} (신뢰 ${fracs.length}명)\n`);

  for (let i = 0; i < ORDER.length; i++) {
    const name = ORDER[i];
    const file = path.join(SRC_DIR, name + ".png");
    if (!fs.existsSync(file)) { console.log(`  누락: ${name}`); continue; }

    const p = await placementFor(name, file, fallbackFrac);
    const dispW = Math.round(p.w * SCALE);
    const dispH = Math.round(dispW * 1.5);

    const photo = await sharp(file).resize({ width: dispW, height: dispH, fit: "fill" }).png().toBuffer();

    // 카드 크기 캔버스에 오프셋만큼 앉힌다. 캔버스 밖으로 나가는 부분은 잘라야 하므로,
    // 큰 캔버스에 합성한 뒤 카드 영역만 잘라낸다(sharp의 composite는 음수 top/left를 못 받음).
    const padX = Math.max(0, Math.ceil(-p.dx * SCALE));
    const padY = Math.max(0, Math.ceil(-p.dy * SCALE));
    const bigW = padX + outW + Math.max(0, dispW);
    const bigH = padY + outH + Math.max(0, dispH);

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
    rows.push({ num, name, source: p.source, w: Math.round(p.w), dx: Math.round(p.dx), dy: Math.round(p.dy), kb });
  }

  console.log("번호 이름     출처    표시폭  dx    dy    용량");
  rows.forEach((r) =>
    console.log(
      `${r.num}  ${r.name.padEnd(6)} ${r.source.padEnd(6)} ${String(r.w).padStart(5)} ${String(r.dx).padStart(5)} ${String(r.dy).padStart(5)}  ${r.kb}KB`
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

const rows = await build();
const sheetPath = process.argv[2];
if (sheetPath) await sheet(sheetPath);
