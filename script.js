const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector("#contact-form");
const statusMessage = document.querySelector("#form-status");
const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");

const setupHeaderScroll = () => {
  if (!header) return;

  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
};

const setupHeroSplit = () => {
  const title = document.querySelector("[data-split]");
  if (!title) return;

  const text = title.getAttribute("data-split") || title.textContent || "";
  if (!text.trim()) return;

  if (prefersReducedMotion.matches) {
    title.classList.add("is-split");
    return;
  }

  title.classList.add("is-split");
  title.setAttribute("aria-label", text);
  title.innerHTML = [...text]
    .map((char, index) => `<span class="char" style="--i:${index}">${char === " " ? "&nbsp;" : char}</span>`)
    .join("");
};

const setupHeroMotion = () => {
  if (!hero || prefersReducedMotion.matches || !finePointer.matches) {
    hero?.classList.add("is-ready");
    return;
  }

  const cursor = hero.querySelector(".hero-cursor");
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let cursorX = window.innerWidth * 0.5;
  let cursorY = window.innerHeight * 0.45;
  let currentCursorX = cursorX;
  let currentCursorY = cursorY;
  let frame = 0;

  hero.classList.add("is-ready");

  const render = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    currentCursorX += (cursorX - currentCursorX) * 0.12;
    currentCursorY += (cursorY - currentCursorY) * 0.12;

    hero.style.setProperty("--hero-x", `${currentX.toFixed(2)}px`);
    hero.style.setProperty("--hero-y", `${currentY.toFixed(2)}px`);

    if (cursor) {
      cursor.style.transform = `translate3d(${currentCursorX.toFixed(1)}px, ${currentCursorY.toFixed(1)}px, 0)`;
    }

    frame = requestAnimationFrame(render);
  };

  const updateTarget = (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    targetX = Math.max(-1, Math.min(1, x * 2)) * 14;
    targetY = Math.max(-1, Math.min(1, y * 2)) * 12;
    cursorX = event.clientX - rect.left;
    cursorY = event.clientY - rect.top;
    hero.classList.add("is-tracking");
  };

  const resetTarget = () => {
    targetX = 0;
    targetY = 0;
    hero.classList.remove("is-tracking");
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

const setupSkillBars = () => {
  document.querySelectorAll(".bar i[data-width]").forEach((bar) => {
    bar.style.setProperty("--bar-width", bar.getAttribute("data-width") || "0");
  });
};

const animateCounters = (root) => {
  const counters = root.querySelectorAll("[data-count]");
  counters.forEach((el) => {
    const target = Number(el.getAttribute("data-count") || 0);
    const suffix = el.getAttribute("data-suffix") || "";
    if (!target) return;

    if (prefersReducedMotion.matches) {
      el.textContent = `${target}${suffix}`;
      return;
    }

    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
};

const setupReveal = () => {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  document.querySelectorAll(".stagger-grid").forEach((grid) => {
    grid.querySelectorAll(".stagger-item").forEach((item, index) => {
      item.style.setProperty("--stagger", String(index));
    });
  });

  document.querySelectorAll(".skills-wrap span").forEach((item, index) => {
    item.style.setProperty("--stagger", String(index));
  });

  const activate = (el) => {
    el.classList.add("is-visible");

    if (el.classList.contains("about-section") || el.querySelector(".skill-bars")) {
      el.querySelector(".skill-bars")?.classList.add("is-animated");
    }

    if (el.classList.contains("github-band") || el.querySelector("[data-count]")) {
      animateCounters(el);
    }
  };

  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    items.forEach(activate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        activate(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -48px 0px" }
  );

  items.forEach((item) => observer.observe(item));
};

const setupMagneticButtons = () => {
  if (prefersReducedMotion.matches || !finePointer.matches) return;

  document.querySelectorAll(".magnetic").forEach((button) => {
    const strength = 14;

    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength;
      button.style.setProperty("--mx", `${x.toFixed(2)}px`);
      button.style.setProperty("--my", `${y.toFixed(2)}px`);
    });

    button.addEventListener("pointerleave", () => {
      button.style.setProperty("--mx", "0px");
      button.style.setProperty("--my", "0px");
    });
  });
};

const setupResumeCollapse = () => {
  const isMobile = () => window.matchMedia("(max-width: 760px)").matches;

  const syncList = (list, button, forceExpand = false) => {
    const limit = Number(list.getAttribute("data-collapse") || 3);
    const items = [...list.querySelectorAll("li")];
    const needsCollapse = items.length > limit;

    if (!needsCollapse || !isMobile()) {
      list.classList.remove("is-collapsed", "is-expanded");
      button.hidden = true;
      button.setAttribute("aria-expanded", "true");
      return;
    }

    button.hidden = false;

    if (forceExpand || list.classList.contains("is-expanded")) {
      list.classList.remove("is-collapsed");
      list.classList.add("is-expanded");
      button.textContent = "Show less";
      button.setAttribute("aria-expanded", "true");
      return;
    }

    list.classList.add("is-collapsed");
    list.classList.remove("is-expanded");
    button.textContent = "Show more";
    button.setAttribute("aria-expanded", "false");
  };

  document.querySelectorAll(".timeline-item").forEach((item) => {
    const list = item.querySelector(".resume-list");
    const button = item.querySelector(".resume-toggle");
    if (!list || !button) return;

    syncList(list, button);

    button.addEventListener("click", () => {
      const expanding = list.classList.contains("is-collapsed");
      if (expanding) {
        list.classList.remove("is-collapsed");
        list.classList.add("is-expanded");
        button.textContent = "Show less";
        button.setAttribute("aria-expanded", "true");
      } else {
        list.classList.add("is-collapsed");
        list.classList.remove("is-expanded");
        button.textContent = "Show more";
        button.setAttribute("aria-expanded", "false");
      }
    });
  });

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      document.querySelectorAll(".timeline-item").forEach((item) => {
        const list = item.querySelector(".resume-list");
        const button = item.querySelector(".resume-toggle");
        if (!list || !button) return;
        syncList(list, button, list.classList.contains("is-expanded"));
      });
    }, 150);
  });
};

setupHeaderScroll();
setupHeroSplit();
setupHeroMotion();
setupSkillBars();
setupReveal();
setupMagneticButtons();
setupResumeCollapse();

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
