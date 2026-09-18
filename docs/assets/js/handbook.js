const PAGES = Array.from({ length: 11 }, (_, i) =>
  assetUrl(`assets/pages/page-${String(i + 1).padStart(2, "0")}.jpg`)
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
  const maxW = Math.max(260, wrap.clientWidth - 16);
  const maxH = Math.max(360, wrap.clientHeight - 8);
  const ratio = 1680 / 2377;
  let pageW = maxW;
  let pageH = Math.floor(pageW / ratio);
  if (pageH > maxH) {
    pageH = maxH;
    pageW = Math.floor(pageH * ratio);
  }
  return { pageW, pageH };
}

function buildPages(bookEl) {
  bookEl.innerHTML = "";
  PAGES.forEach((src, i) => {
    const page = document.createElement("div");
    page.className = "flip-page";
    const img = document.createElement("img");
    img.src = src;
    img.alt = `会务手册第 ${i + 1} 页`;
    img.draggable = false;
    img.decoding = "async";
    if (i > 1) img.loading = "lazy";
    img.addEventListener("error", () => {
      const local = `assets/pages/page-${String(i + 1).padStart(2, "0")}.jpg`;
      if (!img.getAttribute("src").endsWith(local)) img.src = local;
    });
    page.appendChild(img);
    bookEl.appendChild(page);
  });
  return bookEl.querySelectorAll(".flip-page");
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
  const { pageW, pageH } = measure();
  bookEl.style.width = `${pageW}px`;
  bookEl.style.height = `${pageH}px`;
  const pages = buildPages(bookEl);

  pageFlip = new St.PageFlip(bookEl, {
    width: pageW,
    height: pageH,
    size: "fixed",
    autoSize: false,
    maxShadowOpacity: 0.55,
    showCover: true,
    mobileScrollSupport: false,
    usePortrait: true,
    flippingTime: 800,
    drawShadow: true,
    startPage: startIndex,
    swipeDistance: 22,
    useMouseEvents: true,
    showPageCorners: true,
  });

  pageFlip.loadFromHTML(pages);
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
