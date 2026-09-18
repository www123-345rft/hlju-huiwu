const PAGES = Array.from({ length: 11 }, (_, i) =>
  assetUrl(`assets/pages/page-${String(i + 1).padStart(2, "0")}.jpg`)
);

const img = document.getElementById("pageImg");
const pageTag = document.getElementById("pageTag");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let index = 0;
let startX = 0;

function preload(i) {
  if (i < 0 || i >= PAGES.length) return;
  const el = new Image();
  el.src = PAGES[i];
}

function show(i, dir) {
  index = Math.max(0, Math.min(PAGES.length - 1, i));
  img.classList.remove("turn-next", "turn-prev");
  void img.offsetWidth;
  img.classList.add(dir === "prev" ? "turn-prev" : "turn-next");
  img.src = PAGES[index];
  pageTag.textContent = `${index + 1} / ${PAGES.length}`;
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === PAGES.length - 1;
  preload(index + 1);
  preload(index - 1);
}

prevBtn.addEventListener("click", () => index > 0 && show(index - 1, "prev"));
nextBtn.addEventListener("click", () => index < PAGES.length - 1 && show(index + 1, "next"));
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") prevBtn.click();
  if (e.key === "ArrowRight") nextBtn.click();
});

const stage = document.getElementById("bookStage");
stage.addEventListener("touchstart", (e) => {
  startX = e.changedTouches[0].clientX;
}, { passive: true });
stage.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) < 40) return;
  if (dx < 0) nextBtn.click();
  else prevBtn.click();
}, { passive: true });

img.addEventListener("error", () => {
  const local = `assets/pages/page-${String(index + 1).padStart(2, "0")}.jpg`;
  if (!img.src.endsWith(local)) img.src = local;
});

show(0, "next");
