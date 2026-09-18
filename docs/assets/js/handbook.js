const PAGE_COUNT = 11;
const wrap = document.querySelector(".book-wrap");
const pageTag = document.getElementById("pageTag");
const loading = document.getElementById("bookLoading");
let pageFlip = null;
let startIndex = 0;
let imgs = [];

function relPage(i) {
  return `assets/pages/m/page-${String(i + 1).padStart(2, "0")}.jpg`;
}

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
  const ratio = 1080 / 1528;
  let pageW = maxW;
  let pageH = Math.floor(pageW / ratio);
  if (pageH > maxH) {
    pageH = maxH;
    pageW = Math.floor(pageH * ratio);
  }
  return { pageW, pageH };
}

function loadPage(i) {
  if (i < 0 || i >= imgs.length) return;
  const img = imgs[i];
  if (img.dataset.ready === "1" || img.dataset.loading === "1") return;
  img.dataset.loading = "1";
  img.src = assetUrl(relPage(i));
  setTimeout(() => {
    if (img.dataset.ready === "1" || img.dataset.fallback === "1") return;
    img.dataset.fallback = "1";
    img.src = assetFallback(relPage(i));
  }, 5000);
}

function around(i) {
  loadPage(i);
  loadPage(i + 1);
  loadPage(i + 2);
  loadPage(i - 1);
}

function buildPages(bookEl) {
  bookEl.innerHTML = "";
  imgs = [];
  for (let i = 0; i < PAGE_COUNT; i += 1) {
    const page = document.createElement("div");
    page.className = "flip-page";
    const img = document.createElement("img");
    img.alt = `会务手册第 ${i + 1} 页`;
    img.width = 1080;
    img.height = 1528;
    img.draggable = false;
    img.decoding = "async";
    img.addEventListener("load", () => {
      img.dataset.ready = "1";
      img.dataset.loading = "0";
      if (i === 0 && loading) loading.hidden = true;
    });
    img.addEventListener("error", () => {
      if (img.dataset.fallback === "1") return;
      img.dataset.fallback = "1";
      img.src = assetFallback(relPage(i));
    });
    page.appendChild(img);
    bookEl.appendChild(page);
    imgs.push(img);
  }
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

  wrap.querySelector("#book")?.remove();
  const bookEl = ensureBook();
  const { pageW, pageH } = measure();
  bookEl.style.width = `${pageW}px`;
  bookEl.style.height = `${pageH}px`;
  const pages = buildPages(bookEl);
  around(startIndex);

  pageFlip = new St.PageFlip(bookEl, {
    width: pageW,
    height: pageH,
    size: "fixed",
    autoSize: false,
    maxShadowOpacity: 0.5,
    showCover: true,
    mobileScrollSupport: false,
    usePortrait: true,
    flippingTime: 720,
    drawShadow: true,
    startPage: startIndex,
    swipeDistance: 22,
    useMouseEvents: true,
    showPageCorners: true,
  });

  pageFlip.loadFromHTML(pages);
  pageFlip.on("flip", (e) => {
    pageTag.textContent = `${e.data + 1} / ${PAGE_COUNT}`;
    around(e.data);
  });
  pageFlip.on("init", () => {
    pageTag.textContent = `${pageFlip.getCurrentPageIndex() + 1} / ${PAGE_COUNT}`;
    around(pageFlip.getCurrentPageIndex());
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
  resizeTimer = setTimeout(render, 250);
});

render();
