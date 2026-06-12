const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector("#contact-form");
const statusMessage = document.querySelector("#form-status");
const header = document.querySelector(".site-header");

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
