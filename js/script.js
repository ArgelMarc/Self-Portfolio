

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const navLinks = document.getElementById("nav-links");
  const hamburger = document.getElementById("hamburger");
  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const backToTop = document.getElementById("back-to-top");

  document.getElementById("year").textContent = new Date().getFullYear();

  const closeMenu = () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  };

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  links.forEach((link) => link.addEventListener("click", closeMenu));

  const themeToggle = document.getElementById("theme-toggle");
  const root = document.documentElement;
  let savedTheme = null;
  try { savedTheme = localStorage.getItem("theme"); } catch (e) { }
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) { }
  });

  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 20);
    backToTop.classList.toggle("show", y > 500);

    let current = "home";
    sections.forEach((sec) => {
      if (y >= sec.offsetTop - 120) current = sec.id;
    });

    if (window.innerHeight + y >= document.body.offsetHeight - 2) {
      current = sections[sections.length - 1].id;
    }
    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        entry.target.querySelectorAll(".fill").forEach((bar) => {
          bar.style.width = bar.dataset.width + "%";
          const skill = bar.closest(".skill");
          if (skill) skill.style.setProperty("--p", bar.dataset.width);
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  const phrases = ["BSIT Student and UI/UX Enthusiast"];
  const typed = document.getElementById("typed");
  let p = 0, c = phrases[0].length, deleting = true;

  const type = () => {
    const word = phrases[p];
    typed.textContent = word.slice(0, c);
    if (deleting) {
      c--;
      if (c < 0) { deleting = false; p = (p + 1) % phrases.length; c = 0; }
    } else {
      c++;
      if (c > phrases[p].length) { deleting = true; setTimeout(type, 1600); return; }
    }
    setTimeout(type, deleting ? 45 : 90);
  };
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setTimeout(type, 2000);
  }
  const track = document.querySelector(".projects-grid");
  const prevBtn = document.querySelector(".slider-btn.prev");
  const nextBtn = document.querySelector(".slider-btn.next");

  function updateSliderBtns() {
    if (!track || !prevBtn || !nextBtn) return;
    const max = track.scrollWidth - track.clientWidth;
    prevBtn.disabled = track.scrollLeft <= 2;
    nextBtn.disabled = track.scrollLeft >= max - 2;
  }

  if (track && prevBtn && nextBtn) {
    const step = () => {
      const card = track.querySelector(".project-card");
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    };
    prevBtn.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    nextBtn.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    track.addEventListener("scroll", updateSliderBtns, { passive: true });
    window.addEventListener("resize", updateSliderBtns);
    updateSliderBtns();
  }

  const descriptions = document.querySelectorAll(".project-body p");
  descriptions.forEach((p) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "read-more";
    btn.textContent = "Read more";
    btn.hidden = true;
    btn.addEventListener("click", () => {
      const open = p.classList.toggle("expanded");
      btn.textContent = open ? "Show less" : "Read more";
      btn.setAttribute("aria-expanded", String(open));
    });
    p.after(btn);
  });

  const checkClamped = () => {
    descriptions.forEach((p) => {
      if (p.classList.contains("expanded")) return;
      p.nextElementSibling.hidden = p.scrollHeight <= p.clientHeight + 1;
    });
  };
  checkClamped();
  window.addEventListener("resize", checkClamped);
  if (document.fonts) document.fonts.ready.then(checkClamped);
});
