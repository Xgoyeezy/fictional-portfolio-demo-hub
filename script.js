const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pageLoader = document.querySelector(".page-loader");

if (pageLoader) {
  const hidePageLoader = () => {
    pageLoader.classList.add("is-hidden");
    window.setTimeout(() => pageLoader.remove(), reduceMotion ? 0 : 360);
  };

  const schedulePageLoader = () => {
    window.setTimeout(hidePageLoader, reduceMotion ? 0 : 1250);
  };

  if (document.readyState === "complete") {
    schedulePageLoader();
  } else {
    window.addEventListener("load", schedulePageLoader, { once: true });
  }
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
