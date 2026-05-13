const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pageLoader = document.querySelector(".page-loader");
const pageLoaderStorageKey = "portfolioDemoHubWelcomeSeen";
const pageLoaderReturnParam = new URLSearchParams(window.location.search).get("from") === "sample";
const root = document.documentElement;

function getPageLoaderSeen() {
  try {
    return window.sessionStorage.getItem(pageLoaderStorageKey) === "true";
  } catch {
    return false;
  }
}

function setPageLoaderSeen() {
  try {
    window.sessionStorage.setItem(pageLoaderStorageKey, "true");
  } catch {
    // Browsers can disable session storage; the loader still works without it.
  }
}

function cleanReturnParam() {
  if (!pageLoaderReturnParam) return;

  const url = new URL(window.location.href);
  url.searchParams.delete("from");
  history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

if (pageLoader) {
  if (getPageLoaderSeen() || pageLoaderReturnParam) {
    setPageLoaderSeen();
    document.body.classList.add("loader-seen");
    pageLoader.remove();
    cleanReturnParam();
  } else {
    const hidePageLoader = () => {
      setPageLoaderSeen();
      pageLoader.classList.add("is-hidden");
      window.setTimeout(() => pageLoader.remove(), reduceMotion ? 0 : 360);
    };

    const schedulePageLoader = () => {
      window.setTimeout(hidePageLoader, reduceMotion ? 0 : 1250);
    };

    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", schedulePageLoader, { once: true });
    } else {
      window.requestAnimationFrame(schedulePageLoader);
    }
  }
} else {
  cleanReturnParam();
}

function updateScrollProgress() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
  root.style.setProperty("--scroll-progress", progress.toFixed(4));
}

function setupScrollReveals() {
  const targets = document.querySelectorAll(".hero > *, .guide-download, .package, .pricing h2, .price-list p");

  targets.forEach((element, index) => {
    element.classList.add("scroll-reveal");
    element.style.setProperty("--reveal-delay", `${Math.min(index * 42, 210)}ms`);

    if (element.classList.contains("package")) {
      element.style.setProperty("--reveal-rotate", index % 2 === 0 ? "-1.4deg" : "1.4deg");
    }
  });

  if (reduceMotion) {
    targets.forEach((element) => element.classList.add("in-view"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  );

  targets.forEach((element) => revealObserver.observe(element));
}

if (!reduceMotion) {
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );

  window.addEventListener("resize", updateScrollProgress);
}

setupScrollReveals();
updateScrollProgress();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") {
      event.preventDefault();
      return;
    }

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  });
});
