const root = document.documentElement;
const body = document.body;
const header = document.querySelector(".site-header");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = [...document.querySelectorAll(".nav-link")];
const backToTop = document.querySelector("[data-back-to-top]");
const profileImage = document.querySelector("[data-profile-image]");
const animatedElements = document.querySelectorAll("[data-animate], [data-stagger]");
const counters = [...document.querySelectorAll("[data-count]")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Reveal the page (fade-in) and cancel the no-JS fallback timer.
requestAnimationFrame(() => {
  requestAnimationFrame(() => root.classList.add("is-ready"));
});
window.clearTimeout(window.__revealFallbackTimer);

function showProfileFallback() {
  profileImage?.classList.add("is-missing");
  profileImage?.setAttribute("aria-hidden", "true");
}

function setMenuState(isOpen) {
  nav?.classList.toggle("is-open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  menuToggle?.setAttribute("aria-label", isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação");
  body.classList.toggle("menu-open", isOpen);
}

function closeMenu() {
  setMenuState(false);
}

menuToggle?.addEventListener("click", () => {
  const isOpen = !nav?.classList.contains("is-open");
  setMenuState(Boolean(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    closeMenu();

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

profileImage?.addEventListener("error", showProfileFallback);

if (profileImage?.complete && profileImage.naturalWidth === 0) {
  showProfileFallback();
}

function updateBackToTop() {
  const scrolled = window.scrollY;
  backToTop?.classList.toggle("is-visible", scrolled > 520);
  header?.classList.toggle("is-scrolled", scrolled > 8);
}

backToTop?.addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
});

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const activeLink = navLinks.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
        navLinks.forEach((link) => link.classList.toggle("is-active", link === activeLink));
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0.01,
    }
  );

  sections.forEach((section) => navObserver.observe(section));
}

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  animatedElements.forEach((element) => element.classList.add("is-visible"));
} else {
  body.classList.add("motion-ready");

  const animationObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.15,
    }
  );

  animatedElements.forEach((element) => {
    const isInitiallyVisible = element.getBoundingClientRect().top < window.innerHeight * 0.9;

    if (isInitiallyVisible) {
      element.classList.add("is-visible");
      return;
    }

    animationObserver.observe(element);
  });
}

// Animated count-up for the stats band. The final frame restores the exact
// authored text ("1.346", "94,43%") so formatting is always pixel-correct.
if (counters.length && !prefersReducedMotion && "IntersectionObserver" in window) {
  const states = new Map();

  counters.forEach((counter) => {
    const target = Number.parseFloat(counter.getAttribute("data-count"));

    if (!Number.isFinite(target)) {
      return;
    }

    const decimals = Number.parseInt(counter.getAttribute("data-count-decimals") || "0", 10);
    const suffix = counter.getAttribute("data-count-suffix") || "";
    const format = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    states.set(counter, { target, suffix, format, finalText: counter.textContent, done: false });
    counter.textContent = format.format(0) + suffix;
  });

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        const state = states.get(entry.target);

        if (!entry.isIntersecting || !state || state.done) {
          return;
        }

        state.done = true;
        observer.unobserve(entry.target);

        const duration = 1300;
        const start = performance.now();

        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          if (progress < 1) {
            entry.target.textContent = state.format.format(state.target * eased) + state.suffix;
            requestAnimationFrame(step);
          } else {
            entry.target.textContent = state.finalText;
          }
        }

        requestAnimationFrame(step);
      });
    },
    { threshold: 0.5 }
  );

  states.forEach((_state, counter) => counterObserver.observe(counter));
}

updateBackToTop();
window.addEventListener("scroll", updateBackToTop, { passive: true });
