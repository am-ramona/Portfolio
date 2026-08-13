(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) return [...document.querySelectorAll(el)];
    return document.querySelector(el);
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);

    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Switch color theme
   */
  const getStoredTheme = () => localStorage.getItem("theme");
  const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme) return storedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const setTheme = (theme) => {
    if (theme === "auto") {
      document.documentElement.setAttribute(
        "data-bs-theme",
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      );
    } else {
      document.documentElement.setAttribute("data-bs-theme", theme);
    }

    updateThemeStatus(theme);
  };

  const updateThemeStatus = (selectedTheme) => {
    const themeIconWrapper = document.getElementById("theme-icon");
    const themeIcon = themeIconWrapper?.querySelector("i");

    let iconClass = "";

    switch (selectedTheme) {
      case "light":
        iconClass = "bi bi-sun-fill";
        break;
      case "dark":
        iconClass = "bi bi-moon-stars-fill";
        break;
      case "auto":
      default:
        iconClass = "bi bi-circle-half";
        break;
    }

    // ✅ Correct way to swap Bootstrap icons
    if (themeIcon) {
      themeIcon.className = iconClass;
    }

    // Update active state in dropdown
    document.querySelectorAll("[data-bs-theme-value]").forEach((el) => {
      el.classList.remove("active");
      el.setAttribute("aria-pressed", "false");
    });

    const activeButton = document.querySelector(
      `[data-bs-theme-value="${selectedTheme}"]`
    );

    if (activeButton) {
      activeButton.classList.add("active");
      activeButton.setAttribute("aria-pressed", "true");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const theme = getPreferredTheme();
    setTheme(theme);
    updateThemeStatus(theme);
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (getStoredTheme() === "auto") {
        setTheme("auto");
      }
    });

  document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const theme = toggle.getAttribute("data-bs-theme-value");
      setStoredTheme(theme);
      setTheme(theme);
    });
  });

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on(
    "click",
    "#navbar .nav-link",
    function (e) {
      let section = select(this.hash);
      if (section) {
        e.preventDefault();

        let navbar = select("#navbar");
        let header = select("#header");
        let sections = select("section", true);
        let navlinks = select("#navbar .nav-link", true);

        navlinks.forEach((item) => {
          item.classList.remove("active");
        });

        this.classList.add("active");

        if (navbar.classList.contains("navbar-mobile")) {
          navbar.classList.remove("navbar-mobile");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }

        if (this.hash == "#header") {
          header.classList.remove("header-top");
          sections.forEach((item) => {
            item.classList.remove("section-show");
          });
          return;
        }

        if (!header.classList.contains("header-top")) {
          header.classList.add("header-top");
          setTimeout(function () {
            sections.forEach((item) => {
              item.classList.remove("section-show");
            });
            section.classList.add("section-show");
          }, 350);
        } else {
          sections.forEach((item) => {
            item.classList.remove("section-show");
          });
          section.classList.add("section-show");
        }

        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Play/Pause audio music
   */
  const audio = document.getElementById("myAudio");
  const playPauseButton = document.getElementById("playPauseButton");
  const playIcon = document.getElementById("playIcon");
  const pauseIcon = document.getElementById("pauseIcon");
  const volumeControl = document.getElementById("volumeControl");
  const volumeSlider = document.getElementById("volumeSlider");

  let isPlaying = false;
  let audioLoaded = false;

  // --------------------------------------------------
  // Load audio only after page is fully loaded + user interaction
  // --------------------------------------------------

  function loadAudio() {
    if (audioLoaded) return;

    audio.src = audio.dataset.src;
    audio.load();

    audioLoaded = true;

    window.removeEventListener("pointerdown", loadAudio);
    window.removeEventListener("keydown", loadAudio);
    window.removeEventListener("touchstart", loadAudio);
  }

  // Wait until the entire page has loaded
  window.addEventListener("load", () => {
    // Initial responsive state
    applySmallScreenRule();

    // First user interaction loads the audio
    window.addEventListener("pointerdown", loadAudio, { once: true });
    window.addEventListener("keydown", loadAudio, { once: true });
    window.addEventListener("touchstart", loadAudio, { once: true });
  });

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  function updateUI() {
    if (playIcon) {
      playIcon.style.display = isPlaying ? "none" : "inline";
    }

    if (pauseIcon) {
      pauseIcon.style.display = isPlaying ? "inline" : "none";
    }

    applySmallScreenRule();
  }

  // --------------------------------------------------
  // Play / Pause
  // --------------------------------------------------

  playPauseButton.addEventListener("click", () => {
    // This click itself counts as user interaction
    loadAudio();

    if (audio.paused) {
      audio.play().catch((error) => {
        console.log("Play failed:", error);
      });
    } else {
      audio.pause();
    }
  });

  // --------------------------------------------------
  // Audio state
  // --------------------------------------------------

  audio.addEventListener("play", () => {
    isPlaying = true;
    updateUI();
  });

  audio.addEventListener("pause", () => {
    isPlaying = false;
    updateUI();
  });

  audio.addEventListener("ended", () => {
    isPlaying = false;
    audio.currentTime = 0;
    updateUI();
  });

  // --------------------------------------------------
  // Volume
  // --------------------------------------------------

  if (volumeSlider) {
    audio.volume = Number(volumeSlider.value);

    volumeSlider.addEventListener("input", (e) => {
      audio.volume = Number(e.target.value);
    });
  }

  audio.addEventListener("volumechange", () => {
    if (volumeSlider) {
      volumeSlider.value = audio.volume;
    }
  });

  // --------------------------------------------------
  // Responsive volume control
  // --------------------------------------------------

  function applySmallScreenRule() {
    const isNarrow = window.matchMedia("(max-width: 767px)").matches;

    if (volumeControl) {
      volumeControl.style.display = !isNarrow && isPlaying ? "flex" : "none";
    }
  }

  window.addEventListener("resize", applySmallScreenRule);
  /**
   * Activate/show sections on load with hash links
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      let initial_nav = select(window.location.hash);

      if (initial_nav) {
        let header = select("#header");
        let navlinks = select("#navbar .nav-link", true);

        header.classList.add("header-top");

        navlinks.forEach((item) => {
          if (item.getAttribute("href") == window.location.hash) {
            item.classList.add("active");
          } else {
            item.classList.remove("active");
          }
        });

        setTimeout(function () {
          initial_nav.classList.add("section-show");
        }, 350);

        scrollto(window.location.hash);
      }
    }

    /**
     * Init typed.js
     */
    const selectTyped = document.querySelector(".typed");
    if (selectTyped) {
      let typed_strings = selectTyped.getAttribute("data-typed-items");
      typed_strings = typed_strings
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.replace(/\.$/, ""));
      new Typed(".typed", {
        strings: typed_strings,
        loop: true,
        typeSpeed: 65,
        backSpeed: 50,
        backDelay: 2000,
        smartBackspace: false,
      });
    }

    /**
     * Back To Top event
     */
    const backToTopIcon = document.querySelector("#back-to-top");
    const scrollThreshold = 400;
    const breakpointWidth = 768;

    function isWideScreen() {
      return window.innerWidth >= breakpointWidth;
    }

    function updateBackToTopVisibility() {
      if (!backToTopIcon) return;
      if (!isWideScreen()) {
        backToTopIcon.style.display = "none";
        return;
      }
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      backToTopIcon.style.display =
        scrollTop > scrollThreshold ? "flex" : "none";
    }

    window.addEventListener("scroll", updateBackToTopVisibility);
    window.addEventListener("resize", updateBackToTopVisibility);
    document.addEventListener("DOMContentLoaded", updateBackToTopVisibility);
    if (backToTopIcon) {
      backToTopIcon.addEventListener("click", () => {
        console.log("Back-to-top clicked");
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }

    // document.fonts.ready.then(() => {
    document.fonts.load('16px "bootstrap-icons"').then(() => {
      const spinnerWrapperEl = document.querySelector(".spinner-wrapper");
      spinnerWrapperEl.style.opacity = "0";
      spinnerWrapperEl.style.display = "none";

      window.addEventListener("load", () => {
        const icon = document.getElementById("loadingIcon");
        if (icon) {
          icon.classList.remove("spin-on-load");
        }
      });
    });

    var i = 0;
    const typewriterSelector = document.querySelector("#header h2 > span");
    const typewriterPhrase =
      "Passionate Versatile Technical Professional, a Front-end Connoisseur, a Web3 Aficionado.";
    var speed = 50;

    function typeWriter() {
      if (i < typewriterPhrase.length) {
        typewriterSelector.innerHTML += typewriterPhrase.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    }
    // typeWriter();
  });

  /**
   * Skills animation
   */
  let skilsContent = select(".skills-content");
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: "80%",
      handler: function (direction) {
        let progress = select(".progress .progress-bar", true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute("aria-valuenow") + "%";
        });
      },
    });
  }

  /**
   * Cursor
   */

  var cursor = {
    delay: 8,
    _x: 0,
    _y: 0,
    endX: window.innerWidth / 2,
    endY: window.innerHeight / 2,
    cursorVisible: true,
    cursorEnlarged: false,
    $dot: document.querySelector(".cursor-dot"),
    $outline: document.querySelector(".cursor-dot-outline"),

    init: function () {
      // Set up element sizes
      this.dotSize = this.$dot.offsetWidth;
      this.outlineSize = this.$outline.offsetWidth;

      this.setupEventListeners();
      this.animateDotOutline();
    },

    //     updateCursor: function(e) {
    //         var self = this;

    //         console.log(e)

    //         // Show the cursor
    //         self.cursorVisible = true;
    //         self.toggleCursorVisibility();

    //         // Position the dot
    //         self.endX = e.pageX;
    //         self.endY = e.pageY;
    //         self.$dot.style.top = self.endY + 'px';
    //         self.$dot.style.left = self.endX + 'px';
    //     },

    setupEventListeners: function () {
      var self = this;

      // Anchor hovering
      document.querySelectorAll("a, button").forEach(function (el) {
        el.addEventListener("mouseover", function () {
          self.cursorEnlarged = true;
          self.toggleCursorSize();
        });
        el.addEventListener("mouseout", function () {
          self.cursorEnlarged = false;
          self.toggleCursorSize();
        });
      });

      // Click events
      document.addEventListener("mousedown", function () {
        self.cursorEnlarged = true;
        self.toggleCursorSize();
      });
      document.addEventListener("mouseup", function () {
        self.cursorEnlarged = false;
        self.toggleCursorSize();
      });

      document.addEventListener("mousemove", function (e) {
        // Show the cursor
        self.cursorVisible = true;
        self.toggleCursorVisibility();

        // Position the dot
        self.endX = e.pageX;
        self.endY = e.pageY;
        self.$dot.style.top = self.endY + "px";
        self.$dot.style.left = self.endX + "px";
      });

      // Hide/show cursor
      document.addEventListener("mouseenter", function (e) {
        self.cursorVisible = true;
        self.toggleCursorVisibility();
        self.$dot.style.opacity = 1;
        self.$outline.style.opacity = 1;
      });

      document.addEventListener("mouseleave", function (e) {
        self.cursorVisible = true;
        self.toggleCursorVisibility();
        self.$dot.style.opacity = 0;
        self.$outline.style.opacity = 0;
      });
    },

    animateDotOutline: function () {
      var self = this;

      self._x += (self.endX - self._x) / self.delay;
      self._y += (self.endY - self._y) / self.delay;
      self.$outline.style.top = self._y + "px";
      self.$outline.style.left = self._x + "px";

      requestAnimationFrame(this.animateDotOutline.bind(self));
    },

    toggleCursorSize: function () {
      var self = this;

      if (self.cursorEnlarged) {
        self.$dot.style.transform = "translate(-50%, -50%) scale(0.75)";
        self.$outline.style.transform = "translate(-50%, -50%) scale(1.5)";
      } else {
        self.$dot.style.transform = "translate(-50%, -50%) scale(1)";
        self.$outline.style.transform = "translate(-50%, -50%) scale(1)";
      }
    },

    toggleCursorVisibility: function () {
      var self = this;

      if (self.cursorVisible) {
        self.$dot.style.opacity = 1;
        self.$outline.style.opacity = 1;
      } else {
        self.$dot.style.opacity = 0;
        self.$outline.style.opacity = 0;
      }
    },
  };

  cursor.init();

  /**
   * Testimonials slider
   */
  new Swiper(".testimonials-slider", {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: "auto",
    pagination: {
      el: ".testimonials-slider .swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  });

  /**
   * Portfolio isotope and filter
   */
  window.addEventListener("load", () => {
    let portfolioContainer = select(".portfolio-container");
    // let portfolioContainer = document.querySelectorAll('.portfolio-container')[1];
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
        layoutMode: "fitRows",
      });

      let portfolioFilters = select("#portfolio-flters li", true);

      on(
        "click",
        "#portfolio-flters li",
        function (e) {
          e.preventDefault();
          portfolioFilters.forEach(function (el) {
            el.classList.remove("filter-active");
          });
          this.classList.add("filter-active");

          portfolioIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
        },
        true
      );
    }
  });

  /**
   * Initiate portfolio lightbox
   */
  const portfolioLightbox = GLightbox({
    selector: ".portfolio-lightbox",
  });

  /**
   * Initiate portfolio details lightbox
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: ".portfolio-details-lightbox",
    width: "90%",
    height: "90vh",
  });

  /**
   * Portfolio details slider
   */
  // new Swiper('.portfolio-details-slider', {
  //   speed: 400,
  //   loop: true,
  //   autoplay: {
  //     delay: 5000,
  //     disableOnInteraction: false
  //   },
  //   pagination: {
  //     el: '.portfolio-details-slider .swiper-pagination',
  //     type: 'bullets',
  //     clickable: true
  //   }
  // });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /** Web3 Animation **/
})();
