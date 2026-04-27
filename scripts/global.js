/* ============================================================
   NOVAMIND AI — GLOBAL JS v3
   Shared across ALL pages.
   Runs after DOM is ready (deferred or end-of-body).
   ============================================================ */
(function () {
  "use strict";

  /* ═══════════════════════════════════════════════════════
     1. PRELOADER
     ═══════════════════════════════════════════════════════ */
  function initPreloader() {
    // Inject preloader HTML dynamically so every page gets it
    const pre = document.createElement("div");
    pre.id = "preloader";
    pre.innerHTML = `
      <div class="preloader-ring"></div>
      <div class="preloader-logo">Nova<span>Mind</span> AI</div>
      <div class="preloader-bar-wrap">
        <div class="preloader-bar"></div>
      </div>`;
    document.body.prepend(pre);

    // Hide after 1.4s (bar animation completes)
    window.addEventListener("load", function () {
      setTimeout(function () {
        pre.classList.add("hidden");
        // Remove from DOM after transition
        pre.addEventListener(
          "transitionend",
          function () {
            if (pre.parentNode) pre.parentNode.removeChild(pre);
          },
          { once: true },
        );
      }, 1400);
    });
  }
  initPreloader();

  /* ═══════════════════════════════════════════════════════
     2. PAGE TRANSITION OVERLAY
     ═══════════════════════════════════════════════════════ */
  function initPageTransition() {
    // Reuse existing overlay or create one
    let overlay = document.querySelector(".page-transition, .page-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "page-transition";
      document.body.appendChild(overlay);
    }
    // Fade-in on arrival
    overlay.classList.add("active");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.remove("active");
      });
    });
    // Fade-out on navigation
    document.querySelectorAll("a[href]").forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto") ||
        href.startsWith("tel")
      )
        return;
      link.addEventListener("click", function (e) {
        e.preventDefault();
        overlay.classList.add("active");
        setTimeout(function () {
          window.location.href = href;
        }, 460);
      });
    });
  }
  initPageTransition();

  /* ═══════════════════════════════════════════════════════
     3. CURSOR GLOW
     ═══════════════════════════════════════════════════════ */
  function initCursorGlow() {
    var cursor = document.getElementById("cursorGlow");
    if (!cursor) return;
    var tx = window.innerWidth / 2,
      ty = window.innerHeight / 2;
    var cx = tx,
      cy = ty;
    document.addEventListener("mousemove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
    });
    function moveCursor() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";
      requestAnimationFrame(moveCursor);
    }
    moveCursor();
    // Enlarge on links/buttons
    document.querySelectorAll("a, button").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cursor.style.width = "500px";
        cursor.style.height = "500px";
      });
      el.addEventListener("mouseleave", function () {
        cursor.style.width = "420px";
        cursor.style.height = "420px";
      });
    });
  }
  initCursorGlow();

  /* ═══════════════════════════════════════════════════════
     4. NAVBAR — scroll + hamburger + active link
     ═══════════════════════════════════════════════════════ */
  function initNavbar() {
    var navbar = document.getElementById("navbar");
    if (navbar) {
      var onScroll = function () {
        navbar.classList.toggle("scrolled", window.scrollY > 36);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    // Hamburger (both class names used across pages)
    var burger =
      document.getElementById("navHamburger") ||
      document.getElementById("hamburger");
    var navLinks = document.getElementById("navLinks");
    console.log("Burger found:", burger ? burger.id : "none");
    console.log("NavLinks found:", navLinks);
    if (burger && navLinks) {
      console.log("Adding burger click listener");
      burger.addEventListener("click", function () {
        console.log("Burger clicked, toggling open class");
        navLinks.classList.toggle("open");
      });
      navLinks.querySelectorAll(".nav-link").forEach(function (l) {
        l.addEventListener("click", function () {
          console.log("Nav link clicked, removing open class");
          navLinks.classList.remove("open");
        });
      });
    }

    // Auto-set active class based on current page
    var page = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(function (link) {
      var href = link.getAttribute("href") || "";
      link.classList.toggle(
        "active",
        href === page || (href === "index.html" && page === ""),
      );
    });
  }
  initNavbar();

  /* ═══════════════════════════════════════════════════════
     5. FLOATING BACKGROUND ORBS
     Inject into every page if not already present
     ═══════════════════════════════════════════════════════ */
  function initBgOrbs() {
    // If the page already has .bg-orbs (index/contact/about), skip
    if (document.querySelector(".bg-orbs")) return;
    var wrap = document.createElement("div");
    wrap.className = "bg-orbs";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML = `
      <div class="bg-orb bg-orb-1"></div>
      <div class="bg-orb bg-orb-2"></div>
      <div class="bg-orb bg-orb-3"></div>
      <div class="bg-orb bg-orb-4"></div>`;
    document.body.insertBefore(wrap, document.body.firstChild);
  }
  initBgOrbs();

  /* ═══════════════════════════════════════════════════════
     6. ANIMATED SECTION DIVIDERS
     Inject between every <section> automatically
     ═══════════════════════════════════════════════════════ */
  function initSectionDividers() {
    var sections = document.querySelectorAll("section");
    sections.forEach(function (sec, i) {
      if (i === 0) return; // no divider before first section
      var div = document.createElement("div");
      div.className = "section-divider";
      sec.parentNode.insertBefore(div, sec);
    });
  }
  initSectionDividers();

  /* ═══════════════════════════════════════════════════════
     7. SCROLL ANIMATIONS — reveal-up, slide-left, slide-right, reveal-scale
     ═══════════════════════════════════════════════════════ */
  function initScrollReveal() {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -44px 0px" },
    );

    document
      .querySelectorAll(".reveal-up, .slide-left, .slide-right, .reveal-scale")
      .forEach(function (el) {
        io.observe(el);
      });
  }
  initScrollReveal();

  /* ═══════════════════════════════════════════════════════
     8. COUNT-UP NUMBER ANIMATION
     ═══════════════════════════════════════════════════════ */
  function initCountUp() {
    var countIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !entry.target._counted) {
            entry.target._counted = true;
            animateCount(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );

    document.querySelectorAll("[data-target]").forEach(function (el) {
      countIO.observe(el);
    });
  }

  function animateCount(el) {
    var target = parseFloat(el.dataset.target);
    var suffix = el.dataset.suffix || "";
    var decimal = parseInt(el.dataset.decimal || 0);
    var dur = 2000;
    var start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var val = (1 - Math.pow(1 - p, 3)) * target;
      el.textContent =
        (decimal > 0 ? val.toFixed(decimal) : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  initCountUp();

  /* ═══════════════════════════════════════════════════════
     9. FAQ ACCORDION
     ═══════════════════════════════════════════════════════ */
  function initFaq() {
    document.querySelectorAll(".faq-question").forEach(function (q) {
      q.addEventListener("click", function () {
        var item = q.closest(".faq-item");
        var wasOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item").forEach(function (i) {
          i.classList.remove("open");
        });
        if (!wasOpen) item.classList.add("open");
      });
    });
  }
  initFaq();

  /* ═══════════════════════════════════════════════════════
     10. CONTACT FORM — generic handler
     ═══════════════════════════════════════════════════════ */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    var success = document.getElementById("formSuccess");
    var wrap = document.getElementById("contactFormWrap");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector(
        'button[type="submit"], .form-submit, .btn-submit',
      );
      if (btn) {
        btn.textContent = "Sending…";
        btn.disabled = true;
        btn.style.opacity = ".7";
      }

      setTimeout(function () {
        if (wrap) wrap.style.display = "none";
        if (success) {
          success.style.display = "block";
          success.classList.add("visible");
        }
      }, 1400);
    });
  }
  initContactForm();

  /* ═══════════════════════════════════════════════════════
     11. BTN-GLOW — add 'btn-glow' class to .btn-primary elements
         that don't already have it, for universal glow
     ═══════════════════════════════════════════════════════ */
  document
    .querySelectorAll(".btn-primary:not(.btn-glow)")
    .forEach(function (btn) {
      btn.classList.add("btn-glow");
    });
})();
