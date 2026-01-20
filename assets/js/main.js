(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)

    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }


  /**
 * Switch color theme
 */
  const getStoredTheme = () => localStorage.getItem('theme');
  const setStoredTheme = theme => localStorage.setItem('theme', theme);

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = theme => {
    if (theme === 'auto') {
      document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme);
    }
    updateThemeStatus(theme);
  };

  const updateThemeStatus = selectedTheme => {
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    const statusElement = document.getElementById('current-theme-status');

    if (statusElement) {
      statusElement.textContent = selectedTheme;
    }

    let icon = '';
    let text = '';
    switch (selectedTheme) {
      case 'light':
        icon = '🔆';
        text = 'Light';
        break;
      case 'dark':
        icon = '🌙';
        text = 'Dark';
        break;
      case 'auto':
        icon = '⚙️';
        text = 'Auto';
        break;
    }
    if (themeIcon) themeIcon.textContent = icon;
    if (themeText) themeText.textContent = text;

    document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
      element.classList.remove('active');
      element.setAttribute('aria-pressed', 'false');
    });
    const activeThemeButton = document.querySelector(`[data-bs-theme-value="${selectedTheme}"]`);
    if (activeThemeButton) {
      activeThemeButton.classList.add('active');
      activeThemeButton.setAttribute('aria-pressed', 'true');
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const initialTheme = getPreferredTheme();
    setTheme(initialTheme);
    updateThemeStatus(getStoredTheme() || 'auto'); // Update dropdown UI based on stored pref or auto
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getStoredTheme() === 'auto') {
      setTheme('auto');
    }
  });

  document.querySelectorAll('[data-bs-theme-value]')
    .forEach(toggle => {
      toggle.addEventListener('click', () => {
        const theme = toggle.getAttribute('data-bs-theme-value');
        setStoredTheme(theme);
        setTheme(theme);
        updateThemeStatus(theme);
      });
    });

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function (e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on('click', '#navbar .nav-link', function (e) {
    let section = select(this.hash)
    if (section) {
      e.preventDefault()

      let navbar = select('#navbar')
      let header = select('#header')
      let sections = select('section', true)
      let navlinks = select('#navbar .nav-link', true)

      navlinks.forEach((item) => {
        item.classList.remove('active')
      })

      this.classList.add('active')

      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }

      if (this.hash == '#header') {
        header.classList.remove('header-top')
        sections.forEach((item) => {
          item.classList.remove('section-show')
        })
        return;
      }

      if (!header.classList.contains('header-top')) {
        header.classList.add('header-top')
        setTimeout(function () {
          sections.forEach((item) => {
            item.classList.remove('section-show')
          })
          section.classList.add('section-show')

        }, 350);
      } else {
        sections.forEach((item) => {
          item.classList.remove('section-show')
        })
        section.classList.add('section-show')
      }

      scrollto(this.hash)
    }
  }, true)

  /**
 * Play/Pause audio music
 */
  const audio = document.getElementById('myAudio');
  const playPauseButton = document.getElementById('playPauseButton');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const volumeControl = document.getElementById('volumeControl');
  const volumeSlider = document.getElementById('volumeSlider');

  if (volumeSlider && typeof volumeSlider.value !== 'undefined') {
    audio.volume = volumeSlider.value;
  }

  // let isPlaying = false;
  let isPlaying = !audio.paused && !audio.ended && audio.currentTime > 0;

  function togglePlayPause() {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  playPauseButton.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(error => {
        console.log("Play failed:", error);
      });
    } else {
      audio.pause();
    }
  });

  const isNarrow = window.matchMedia('(max-width: 767px)').matches;

  audio.addEventListener('play', () => {
    isPlaying = true;
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'inline';
    if (volumeControl && !isNarrow) volumeControl.style.display = 'flex';
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    if (playIcon) playIcon.style.display = 'inline';
    if (pauseIcon) pauseIcon.style.display = 'none';
    if (volumeControl) volumeControl.style.display = 'none';
  });

  audio.addEventListener('ended', () => {
    isPlaying = false;
    if (playIcon) playIcon.style.display = 'inline';
    if (pauseIcon) pauseIcon.style.display = 'none';
    if (volumeControl) volumeControl.style.display = 'none';
    audio.currentTime = 0;
  });

  volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
  });

  audio.addEventListener('volumechange', () => {
    if (volumeSlider) volumeSlider.value = audio.volume;
  });

  function applySmallScreenRule() {
    const isNarrow = window.matchMedia('(max-width: 767px)').matches;

    const volumeControl = document.getElementById("volumeControl");

    if (volumeControl) {
      volumeControl.style.display = (!isNarrow && isPlaying) ? 'flex' : 'none';
    } else {
      console.warn('volumeControl element not found');
    }
  }
  window.addEventListener('load', applySmallScreenRule);
  window.addEventListener('resize', applySmallScreenRule);

  /**
   * Activate/show sections on load with hash links
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      let initial_nav = select(window.location.hash)

      if (initial_nav) {
        let header = select('#header')
        let navlinks = select('#navbar .nav-link', true)

        header.classList.add('header-top')

        navlinks.forEach((item) => {
          if (item.getAttribute('href') == window.location.hash) {
            item.classList.add('active')
          } else {
            item.classList.remove('active')
          }
        })

        setTimeout(function () {
          initial_nav.classList.add('section-show')
        }, 350);

        scrollto(window.location.hash)
      }
    }

    /**
     * Init typed.js
     */
    const selectTyped = document.querySelector('.typed');
    if (selectTyped) {
      let typed_strings = selectTyped.getAttribute('data-typed-items');
      typed_strings = typed_strings.split(',');
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 65,
        backSpeed: 50,
        backDelay: 2000
      });
    }

    const backToTopIcon = document.querySelector('#back-to-top');
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
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      backToTopIcon.style.display = (scrollTop > scrollThreshold) ? "flex" : "none";
    }

    window.addEventListener('scroll', updateBackToTopVisibility);
    window.addEventListener('resize', updateBackToTopVisibility);
    document.addEventListener('DOMContentLoaded', updateBackToTopVisibility);
    if (backToTopIcon) {
      backToTopIcon.addEventListener('click', () => {
        console.log('Back-to-top clicked');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const spinnerWrapperEl = document.querySelector(".spinner-wrapper");
    spinnerWrapperEl.style.opacity = '0';
    spinnerWrapperEl.style.display = 'none';

    window.addEventListener('load', () => {
      const icon = document.getElementById('loadingIcon');
      if (icon) {
        icon.classList.remove('spin-on-load');
      }
    });

    var i = 0;
    const typewriterSelector = document.querySelector('#header h2 > span');
    const typewriterPhrase = 'Passionate Versatile Technical Professional, a Front-end Connoisseur, a Web3 Aficionado.';
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
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function (direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    // let portfolioContainer = document.querySelectorAll('.portfolio-container')[1]; 
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);


      on('click', '#portfolio-flters li', function (e) {
        e.preventDefault();
        portfolioFilters.forEach(function (el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Initiate portfolio details lightbox 
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();


  /** Web3 Animation **/

})()