const reveals = document.querySelectorAll(".reveal");
const root = document.documentElement;
const pageBg = document.querySelector(".page-bg");
const glows = document.querySelectorAll(".glow");

const rotatingDaisies = [
  { el: document.querySelector(".daisy-a"), yBase: 0, yMove: 22, baseRotate: -8, angle: -8, spinFactor: 0.22, floatPhase: 0.2 },
  { el: document.querySelector(".daisy-b"), yBase: 0, yMove: 20, baseRotate: 7, angle: 7, spinFactor: -0.24, floatPhase: 0.8 },
  { el: document.querySelector(".daisy-c"), yBase: 0, yMove: 18, baseRotate: -6, angle: -6, spinFactor: 0.20, floatPhase: 1.1 },
  { el: document.querySelector(".daisy-d"), yBase: 0, yMove: 18, baseRotate: 5, angle: 5, spinFactor: -0.21, floatPhase: 1.7 },
  { el: document.querySelector(".daisy-e"), yBase: 0, yMove: 20, baseRotate: -7, angle: -7, spinFactor: 0.19, floatPhase: 2.0 },
  { el: document.querySelector(".daisy-f"), yBase: 0, yMove: 18, baseRotate: 6, angle: 6, spinFactor: -0.18, floatPhase: 2.5 },
  { el: document.querySelector(".daisy-g"), yBase: 0, yMove: 16, baseRotate: -5, angle: -5, spinFactor: 0.17, floatPhase: 3.0 },
  { el: document.querySelector(".daisy-h"), yBase: 0, yMove: 14, baseRotate: 4, angle: 4, spinFactor: -0.16, floatPhase: 3.4 },
  { el: document.querySelector(".daisy-i"), yBase: 0, yMove: 15, baseRotate: -4, angle: -4, spinFactor: 0.16, floatPhase: 3.9 },
  { el: document.querySelector(".daisy-j"), yBase: 0, yMove: 14, baseRotate: 5, angle: 5, spinFactor: -0.15, floatPhase: 4.3 }
];

const staticDaisies = [
  document.querySelector(".daisy-stem"),
  document.querySelector(".daisy-end"),
  document.querySelector(".daisy-end-2")
];

let lastScrollY = window.scrollY;
let currentScrollY = window.scrollY;
let ticking = false;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -8% 0px"
  }
);

reveals.forEach((el) => observer.observe(el));

function syncBgHeight() {
  const height = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );

  if (pageBg) {
    pageBg.style.height = `${height}px`;
  }
}

function isVisible(el) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

function updateGradient(progress) {
  const g1x = 18 + progress * 22;
  const g1y = 12 + progress * 18;

  const g2x = 80 - progress * 18;
  const g2y = 18 + progress * 16;

  const g3x = 62 - progress * 14;
  const g3y = 76 - progress * 16;

  const s2 = 14 + progress * 7;
  const s3 = 31 + progress * 9;
  const s4 = 49 + progress * 9;
  const s5 = 67 + progress * 8;
  const s6 = 84 + progress * 5;

  const brightness = 0.99 + progress * 0.12;
  const saturate = 1 + progress * 0.24;

  root.style.setProperty("--g1x", `${g1x}%`);
  root.style.setProperty("--g1y", `${g1y}%`);
  root.style.setProperty("--g2x", `${g2x}%`);
  root.style.setProperty("--g2y", `${g2y}%`);
  root.style.setProperty("--g3x", `${g3x}%`);
  root.style.setProperty("--g3y", `${g3y}%`);

  root.style.setProperty("--s2", `${s2}%`);
  root.style.setProperty("--s3", `${s3}%`);
  root.style.setProperty("--s4", `${s4}%`);
  root.style.setProperty("--s5", `${s5}%`);
  root.style.setProperty("--s6", `${s6}%`);

  root.style.setProperty("--bg-brightness", brightness);
  root.style.setProperty("--bg-saturate", saturate);
}

function updateGlows(progress) {
  if (glows[0]) {
    glows[0].style.transform =
      `translate3d(${progress * 120}px, ${progress * 180}px, 0) scale(${1 + progress * 0.12})`;
  }

  if (glows[1]) {
    glows[1].style.transform =
      `translate3d(${progress * -160}px, ${progress * -60}px, 0) scale(${1 + progress * 0.14})`;
  }

  if (glows[2]) {
    glows[2].style.transform =
      `translate3d(${progress * 90}px, ${progress * -140}px, 0) scale(${1 + progress * 0.10})`;
  }
}

function updateDaisies(progress, scrollDelta) {
  rotatingDaisies.forEach((item, index) => {
    if (!item.el) return;

    if (isVisible(item.el)) {
      item.angle += scrollDelta * item.spinFactor;

      const floatOffset =
        Math.sin(progress * 10 + item.floatPhase + index * 0.35) * 6;

      const driftY = progress * item.yMove + floatOffset;

      item.el.style.transform =
        `translate3d(0, ${driftY}px, 0) rotate(${item.angle}deg)`;
    }
  });

  staticDaisies.forEach((el) => {
    if (!el) return;
    el.style.transform = "none";
  });
}

function updateScene() {
  const scrollTop = currentScrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

  const scrollDelta = scrollTop - lastScrollY;
  lastScrollY = scrollTop;

  updateGradient(progress);
  updateGlows(progress);
  updateDaisies(progress, scrollDelta);

  ticking = false;
}

function requestUpdate() {
  currentScrollY = window.scrollY;

  if (!ticking) {
    requestAnimationFrame(updateScene);
    ticking = true;
  }
}

function fullUpdate() {
  syncBgHeight();
  requestUpdate();
}

window.addEventListener("scroll", requestUpdate, { passive: true });
window.addEventListener("resize", fullUpdate);
window.addEventListener("load", fullUpdate);

setTimeout(fullUpdate, 100);
setTimeout(fullUpdate, 400);
setTimeout(fullUpdate, 900);

fullUpdate();