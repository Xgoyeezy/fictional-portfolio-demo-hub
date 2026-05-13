const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pageLoader = document.querySelector(".page-loader");
const pageLoaderStorageKey = "portfolioDemoHubWelcomeSeen";
const pageLoaderReturnParam = new URLSearchParams(window.location.search).get("from") === "sample";

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
