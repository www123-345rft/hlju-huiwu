const PAGES = Array.from({ length: 11 }, (_, i) =>
  `assets/pages/page-${String(i + 1).padStart(2, "0")}.jpg`
);

const wrap = document.querySelector(".book-wrap");
const pageTag = document.getElementById("pageTag");
let pageFlip = null;
let startIndex = 0;

function ensureBook() {
  let el = document.getElementById("book");
  if (!el) {
    el = document.createElement("div");
    el.id = "book";
    wrap.appendChild(el);
  }
  return el;
}

function measure() {
  const maxW = Math.max(260, wrap.clientWidth - 4);
  const maxH = Math.max(340, wrap.clientHeight - 4);
  const ratio = 1429 / 2021;
  let pageW = maxW;
  let pageH = Math.floor(pageW / ratio);
  if (pageH > maxH) {
    pageH = maxH;
    pageW = Math.floor(pageH * ratio);
  }
  return { pageW, pageH, boxW: pageW, boxH: pageH };
}

function render() {
  if (pageFlip) {
    startIndex = pageFlip.getCurrentPageIndex();
    try {
      pageFlip.destroy();
    } catch (err) {
      /* ignore */
    }
    pageFlip = null;
  }

  wrap.innerHTML = "";
  const bookEl = ensureBook();
  const { pageW, pageH, boxW, boxH } = measure();
  bookEl.style.width = `${boxW}px`;
  bookEl.style.height = `${boxH}px`;

  pageFlip = new St.PageFlip(bookEl, {
    width: pageW,
    height: pageH,
    size: "fixed",
    autoSize: false,
    maxShadowOpacity: 0.5,
    showCover: true,
    mobileScrollSupport: false,
    usePortrait: true,
    flippingTime: 740,
    drawShadow: true,
    startPage: startIndex,
    swipeDistance: 24,
    useMouseEvents: true,
  });

  pageFlip.loadFromImages(PAGES);
  pageFlip.on("flip", (e) => {
    pageTag.textContent = `${e.data + 1} / ${PAGES.length}`;
  });
  pageFlip.on("init", () => {
    pageTag.textContent = `${pageFlip.getCurrentPageIndex() + 1} / ${PAGES.length}`;
  });
}

document.getElementById("prevBtn").addEventListener("click", () => pageFlip && pageFlip.flipPrev());
document.getElementById("nextBtn").addEventListener("click", () => pageFlip && pageFlip.flipNext());
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") pageFlip && pageFlip.flipPrev();
  if (e.key === "ArrowRight") pageFlip && pageFlip.flipNext();
});

let resizeTimer = 0;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(render, 200);
});

render();
