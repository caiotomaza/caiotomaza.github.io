const body = document.body;
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = [...document.querySelectorAll(".nav-link")];
const backToTop = document.querySelector("[data-back-to-top]");
const profileImage = document.querySelector("[data-profile-image]");
const animatedElements = document.querySelectorAll("[data-animate]");
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  const isVisible = window.scrollY > 520;
  backToTop?.classList.toggle("is-visible", isVisible);
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

updateBackToTop();
window.addEventListener("scroll", updateBackToTop, { passive: true });
