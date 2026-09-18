const viewer = document.getElementById("viewer");
const img = document.getElementById("seatImg");

let scale = 1;
let x = 0;
let y = 0;
let pointers = new Map();
let lastDist = 0;
let dragging = false;
let dragStart = { x: 0, y: 0, px: 0, py: 0 };

function apply() {
  img.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
}

function clamp() {
  scale = Math.min(4.5, Math.max(1, scale));
  const maxX = ((scale - 1) * viewer.clientWidth) / 2 + 40;
  const maxY = ((scale - 1) * viewer.clientHeight) / 2 + 40;
  x = Math.max(-maxX, Math.min(maxX, x));
  y = Math.max(-maxY, Math.min(maxY, y));
}

function setScale(next) {
  scale = next;
  if (scale <= 1.02) {
    scale = 1;
    x = 0;
    y = 0;
  }
  clamp();
  apply();
}

document.getElementById("zoomIn").onclick = () => setScale(scale + 0.35);
document.getElementById("zoomOut").onclick = () => setScale(scale - 0.35);
document.getElementById("zoomReset").onclick = () => setScale(1);

viewer.addEventListener("pointerdown", (e) => {
  viewer.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 1) {
    dragging = true;
    dragStart = { x, y, px: e.clientX, py: e.clientY };
  } else if (pointers.size === 2) {
    const pts = [...pointers.values()];
    lastDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    dragging = false;
  }
});

viewer.addEventListener("pointermove", (e) => {
  if (!pointers.has(e.pointerId)) return;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 2) {
    const pts = [...pointers.values()];
    const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    if (lastDist) setScale(scale * (dist / lastDist));
    lastDist = dist;
  } else if (dragging && scale > 1) {
    x = dragStart.x + (e.clientX - dragStart.px);
    y = dragStart.y + (e.clientY - dragStart.py);
    clamp();
    apply();
  }
});

function endPointer(e) {
  pointers.delete(e.pointerId);
  if (pointers.size < 2) lastDist = 0;
  if (pointers.size === 0) dragging = false;
}
viewer.addEventListener("pointerup", endPointer);
viewer.addEventListener("pointercancel", endPointer);

viewer.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    setScale(scale + (e.deltaY < 0 ? 0.2 : -0.2));
  },
  { passive: false }
);
