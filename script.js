const sections = [...document.querySelectorAll("[data-section]")];
const dots = [...document.querySelectorAll(".rail-dot")];
const reveals = [...document.querySelectorAll(".reveal")];
const cursor = document.querySelector(".cursor-light");
const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector(".mobile-nav");
const videos = [...document.querySelectorAll(".panel-video")];
const pageTabs = [...document.querySelectorAll("[data-page-target]")];
const subnav = document.querySelector(".subnav");

const pageOrder = ["overview", "research", "evidence-page", "product", "sources-page"];

function wrapHeadingWords() {
  document.querySelectorAll("main h1, main h2").forEach(heading => {
    if (heading.dataset.wordsReady) return;
    const words = heading.textContent.trim().split(/(\s+)/);
    heading.textContent = "";
    let index = 0;
    words.forEach(part => {
      if (/^\s+$/.test(part)) {
        heading.append(document.createTextNode(part));
        return;
      }
      const span = document.createElement("span");
      span.className = "word";
      span.style.setProperty("--word-index", index);
      span.textContent = part;
      heading.append(span);
      index += 1;
    });
    heading.dataset.wordsReady = "true";
  });
}

function pageForSection(sectionId) {
  return sections.find(section => section.dataset.section === sectionId)?.dataset.page || "overview";
}

function visibleSections() {
  return sections.filter(section => !section.hidden);
}

function ensureVideoSource(video) {
  if (!video || video.src || !video.dataset.src) return;
  video.src = video.dataset.src;
  video.load();
}

function buildSubnav(page) {
  if (!subnav) return;
  subnav.textContent = "";
  sections
    .filter(section => section.dataset.page === page)
    .forEach(section => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.target = section.dataset.section;
      button.textContent = section.dataset.label || section.dataset.section;
      button.addEventListener("click", () => section.scrollIntoView({ behavior: "smooth", block: "start" }));
      subnav.append(button);
    });
}

function setActivePage(page, sectionTarget) {
  const nextPage = pageOrder.includes(page) ? page : "overview";
  sections.forEach(section => {
    const shouldShow = section.dataset.page === nextPage;
    section.hidden = !shouldShow;
    if (!shouldShow) {
      section.querySelector(".panel-video")?.pause();
    }
  });

  pageTabs.forEach(tab => {
    tab.classList.toggle("active", tab.dataset.pageTarget === nextPage);
  });

  dots.forEach(dot => {
    const target = sections.find(section => section.dataset.section === dot.dataset.target);
    dot.hidden = !target || target.dataset.page !== nextPage;
    dot.classList.toggle("active", dot.dataset.target === sectionTarget);
  });

  buildSubnav(nextPage);

  const targetSection =
    sections.find(section => section.dataset.section === sectionTarget && section.dataset.page === nextPage) ||
    sections.find(section => section.dataset.page === nextPage);

  requestAnimationFrame(() => {
    targetSection?.scrollIntoView({ behavior: "auto", block: "start" });
    updateSubnav(targetSection?.dataset.section);
  });

  if (history.replaceState && targetSection) {
    history.replaceState(null, "", `#${targetSection.dataset.section}`);
  }
}

function updateSubnav(sectionId) {
  document.querySelectorAll(".subnav button").forEach(button => {
    button.classList.toggle("active", button.dataset.target === sectionId);
  });
}

wrapHeadingWords();

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      const id = entry.target.dataset.section;
      dots.forEach(dot => dot.classList.toggle("active", dot.dataset.target === id));
      updateSubnav(id);
      if (history.replaceState) history.replaceState(null, "", `#${id}`);
    });
  },
  { threshold: 0.45 }
);

sections.forEach(section => sectionObserver.observe(section));

videos.forEach(video => {
  video.muted = true;
  video.playsInline = true;
  video.addEventListener("loadeddata", () => {
    video.classList.add("video-ready");
    video.closest(".panel")?.classList.add("video-playing");
  }, { once: true });
  if (video.hasAttribute("src") && video.closest(".panel")?.dataset.page === "overview") {
    video.play().catch(() => {});
  }
});

function startHeroVideo() {
  const heroVideo = document.querySelector(".hero-video");
  if (!heroVideo) return;
  ensureVideoSource(heroVideo);
  heroVideo.play().catch(() => {});
}

if ("requestIdleCallback" in window) {
  window.requestIdleCallback(startHeroVideo, { timeout: 1800 });
} else {
  window.setTimeout(startHeroVideo, 900);
}

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("in-view");
    });
  },
  { threshold: 0.18 }
);

reveals.forEach(item => revealObserver.observe(item));

dots.forEach(dot => {
  dot.addEventListener("click", () => {
    const target = sections.find(section => section.dataset.section === dot.dataset.target);
    if (!target) return;
    setActivePage(target.dataset.page, target.dataset.section);
  });
});

pageTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    setActivePage(tab.dataset.pageTarget, tab.dataset.sectionTarget);
    mobileNav.hidden = true;
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("mousemove", event => {
  if (cursor) {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  }

  const active = document.elementFromPoint(event.clientX, event.clientY)?.closest(".panel");
  if (!active) return;
  const x = (event.clientX / window.innerWidth - 0.5) * -10;
  const y = (event.clientY / window.innerHeight - 0.5) * -10;
  active.style.setProperty("--shift-x", `${x}px`);
  active.style.setProperty("--shift-y", `${y}px`);
});

function updateParallax() {
  if (window.matchMedia("(max-width: 980px)").matches) return;
  visibleSections().forEach(section => {
    const rect = section.getBoundingClientRect();
    const progress = (rect.top - window.innerHeight / 2) / window.innerHeight;
    const y = Math.max(-22, Math.min(22, progress * -28));
    section.querySelector(".panel-content")?.style.setProperty("--parallax-y", `${y}px`);
  });
}

document.addEventListener("scroll", () => requestAnimationFrame(updateParallax), { passive: true });

const videoObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const video = entry.target.querySelector(".panel-video");
      if (!video) return;
      if (entry.isIntersecting) {
        ensureVideoSource(video);
        video.play().catch(() => {});
      }
      else video.pause();
    });
  },
  { threshold: 0.2 }
);

sections.forEach(section => {
  if (section.querySelector(".panel-video")) videoObserver.observe(section);
});

mobileNav?.addEventListener("click", event => {
  const button = event.target.closest("[data-page-target]");
  if (!button) return;
  setActivePage(button.dataset.pageTarget);
  mobileNav.hidden = true;
  menuButton?.setAttribute("aria-expanded", "false");
});

document.querySelector(".newsletter-form")?.addEventListener("submit", event => {
  event.preventDefault();
});

window.addEventListener("hashchange", () => {
  const id = location.hash.slice(1);
  if (sections.some(section => section.dataset.section === id)) setActivePage(pageForSection(id), id);
});

const initialSection = location.hash.replace("#", "");
setActivePage(pageForSection(initialSection), initialSection);
updateParallax();
