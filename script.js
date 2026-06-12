const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector("#contact-form");
const statusMessage = document.querySelector("#form-status");
const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const setupHeroMotion = () => {
  if (!hero || prefersReducedMotion.matches || !window.matchMedia("(pointer: fine)").matches) return;

  let targetX = 0;
  let targetY = 0;
  let targetCursorX = 50;
  let targetCursorY = 50;
  let targetCursorOpacity = 0;
  let currentX = 0;
  let currentY = 0;
  let currentCursorX = 50;
  let currentCursorY = 50;
  let currentCursorOpacity = 0;
  let frame = 0;

  const render = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    currentCursorX += (targetCursorX - currentCursorX) * 0.1;
    currentCursorY += (targetCursorY - currentCursorY) * 0.1;
    currentCursorOpacity += (targetCursorOpacity - currentCursorOpacity) * 0.12;

    hero.style.setProperty("--hero-x", `${currentX.toFixed(2)}px`);
    hero.style.setProperty("--hero-y", `${currentY.toFixed(2)}px`);
    hero.style.setProperty("--hero-tilt-x", `${(currentX * 0.16).toFixed(2)}deg`);
    hero.style.setProperty("--hero-tilt-y", `${(currentY * -0.14).toFixed(2)}deg`);
    hero.style.setProperty("--hero-glow-x", `${(58 + currentX * 0.32).toFixed(2)}%`);
    hero.style.setProperty("--hero-glow-y", `${(42 + currentY * 0.28).toFixed(2)}%`);
    hero.style.setProperty("--hero-cursor-x", `${currentCursorX.toFixed(2)}%`);
    hero.style.setProperty("--hero-cursor-y", `${currentCursorY.toFixed(2)}%`);
    hero.style.setProperty("--hero-cursor-opacity", currentCursorOpacity.toFixed(3));
    hero.style.setProperty("--hero-glow-opacity", (0.52 + currentCursorOpacity * 0.28).toFixed(3));
    hero.style.setProperty("--hero-scan-opacity", (0.26 + currentCursorOpacity * 0.34).toFixed(3));

    frame = requestAnimationFrame(render);
  };

  const updateTarget = (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    targetX = Math.max(-1, Math.min(1, x * 2)) * 14;
    targetY = Math.max(-1, Math.min(1, y * 2)) * 12;
    targetCursorX = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    targetCursorY = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    targetCursorOpacity = 1;
  };

  const resetTarget = () => {
    targetX = 0;
    targetY = 0;
    targetCursorX = 50;
    targetCursorY = 50;
    targetCursorOpacity = 0;
  };

  hero.addEventListener("pointermove", updateTarget);
  hero.addEventListener("pointerleave", resetTarget);
  frame = requestAnimationFrame(render);

  prefersReducedMotion.addEventListener("change", () => {
    cancelAnimationFrame(frame);
    resetTarget();
    hero.removeAttribute("style");
  }, { once: true });
};

setupHeroMotion();

const scrollToHash = (hash, updateHistory = true) => {
  if (!hash || hash === "#") return;

  if (hash === "#top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    const target = document.querySelector(hash);
    if (!target) return;

    const headerHeight = header?.getBoundingClientRect().height || 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  }

  if (updateHistory) {
    history.pushState(null, "", hash);
  }
};

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    navLinks.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash) return;

    event.preventDefault();
    scrollToHash(hash);
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const project = String(formData.get("project") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !project || !message) {
    statusMessage.textContent = "Please complete all fields before sending.";
    return;
  }

  const subject = encodeURIComponent(`Portfolio query from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nProject Type: ${project}\n\nMessage:\n${message}`
  );

  statusMessage.textContent = "Opening your email app with the query details.";
  window.location.href = `mailto:sabih.sk1@gmail.com?subject=${subject}&body=${body}`;
});
