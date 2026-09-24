document.addEventListener('DOMContentLoaded', () => {
  // Navigation Pill Active State
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Mobile Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileDrawer.classList.remove('active');
      }
    });
  }


  /* ==========================================================================
     HERO SECTION DYNAMIC BACKGROUND SLIDESHOW (3-SECOND ROTATION & MOBILE SYNC)
     ========================================================================== */
  function initHeroSlideshow() {
    const layer1 = document.getElementById('heroBgLayer1');
    const layer2 = document.getElementById('heroBgLayer2');
    const desktopCards = Array.from(document.querySelectorAll('.sports-card'));
    const mobileCards = Array.from(document.querySelectorAll('.mobile-sport-card'));
    const carousel = document.querySelector('.mobile-cards-carousel');
    const dots = Array.from(document.querySelectorAll('.mobile-dots .dot'));

    if (!layer1 || !layer2 || desktopCards.length === 0) return;

    const slides = desktopCards.map((card, idx) => {
      const desktopImg = card.querySelector('img');
      const mobileCard = mobileCards[idx];
      const mobileImg = mobileCard ? mobileCard.querySelector('img') : null;

      const desktopSrc = desktopImg ? (desktopImg.getAttribute('src') || desktopImg.src) : '';
      const mobileSrc = mobileImg ? (mobileImg.getAttribute('src') || mobileImg.src) : desktopSrc;

      return {
        sport: card.getAttribute('data-sport'),
        desktopImage: desktopSrc,
        mobileImage: mobileSrc
      };
    });

    function getSlideImage(slide) {
      if (!slide) return '';
      return window.innerWidth <= 768 ? slide.mobileImage : slide.desktopImage;
    }

    // Preload slide images
    slides.forEach(slide => {
      const imgD = new Image();
      imgD.src = slide.desktopImage;
      const imgM = new Image();
      imgM.src = slide.mobileImage;
    });

    let currentIndex = 0;
    let activeLayer = layer1;
    let inactiveLayer = layer2;
    let slideshowTimer = null;

    // Set initial background image
    activeLayer.style.backgroundImage = `url('${getSlideImage(slides[0])}')`;
    activeLayer.classList.add('active');

    function updateActiveCardStates(slideIdx) {
      const currentSport = slides[slideIdx]?.sport;

      // Update Desktop Cards
      desktopCards.forEach((card, idx) => {
        if (idx === slideIdx || card.getAttribute('data-sport') === currentSport) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });

      // Update Mobile Cards & Auto-Scroll Carousel
      if (mobileCards.length > 0) {
        mobileCards.forEach((card, idx) => {
          if (idx === slideIdx || card.getAttribute('data-sport') === currentSport) {
            card.classList.add('active', 'featured');
          } else {
            card.classList.remove('active', 'featured');
          }
        });

        const activeMobileCard = mobileCards[slideIdx] || mobileCards.find(c => c.getAttribute('data-sport') === currentSport);
        if (carousel && activeMobileCard && !window.isUserTouchingMobileCarousel) {
          const cardLeft = activeMobileCard.offsetLeft;
          const cardWidth = activeMobileCard.offsetWidth;
          const carouselWidth = carousel.offsetWidth;
          const scrollTarget = cardLeft - (carouselWidth / 2) + (cardWidth / 2);

          carousel.scrollTo({
            left: Math.max(0, scrollTarget),
            behavior: 'smooth'
          });
        }
      }

      // Update Mobile Dots
      dots.forEach((dot, idx) => {
        if (idx === slideIdx) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function goToSlide(index) {
      if (index === currentIndex) return;

      const nextSlide = slides[index];
      currentIndex = index;

      inactiveLayer.style.backgroundImage = `url('${getSlideImage(nextSlide)}')`;
      inactiveLayer.classList.add('active');
      activeLayer.classList.remove('active');

      const temp = activeLayer;
      activeLayer = inactiveLayer;
      inactiveLayer = temp;

      updateActiveCardStates(currentIndex);
    }

    function nextSlide() {
      const nextIdx = (currentIndex + 1) % slides.length;
      goToSlide(nextIdx);
    }

    function startTimer() {
      stopTimer();
      slideshowTimer = setInterval(nextSlide, 3000);
    }

    function stopTimer() {
      if (slideshowTimer) {
        clearInterval(slideshowTimer);
        slideshowTimer = null;
      }
    }

    // Attach click listeners to desktop cards
    desktopCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        goToSlide(idx);
        startTimer();
      });
    });

    // Attach click listeners to mobile cards
    mobileCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        goToSlide(idx);
        startTimer();
      });
    });

    // Attach click listeners to mobile dots
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        startTimer();
      });
    });

    // Initial render setup
    updateActiveCardStates(0);

    // Start auto-play
    startTimer();
  }

  initHeroSlideshow();

  /* ==========================================================================
     TIMED POPUP MODAL & QUOTE SYSTEM INTERACTIVITY
     ========================================================================== */
  const modalOverlay = document.getElementById('quoteModalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalForm = document.getElementById('modalQuoteForm');
  const btnModalWhatsApp = document.getElementById('btnModalWhatsApp');

  function openQuoteModal() {
    if (modalOverlay) {
      modalOverlay.classList.add('active');
    }
  }

  function closeQuoteModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  }

  // Auto-popup after 10 seconds on initial visit
  setTimeout(() => {
    if (!sessionStorage.getItem('solai_modal_shown')) {
      openQuoteModal();
      sessionStorage.setItem('solai_modal_shown', 'true');
    }
  }, 10000);

  // Close modal events
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeQuoteModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeQuoteModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuoteModal();
    }
  });

  // Attach modal trigger to all Quote / Consultation CTA buttons & WhatsApp Float Button across site
  const quoteTriggerBtns = document.querySelectorAll(
    '#headerBookBtn, #leftBookBtn, #mobileCtaBtn, #mobileBannerBookBtn, #drawerBookBtn, .explore-facilities-btn, .final-cta-btn, .banner-community-cta, .story-cta-btn, .faq-cta-banner, .footer-book-btn, #waFloatBtn'
  );

  quoteTriggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openQuoteModal();
    });
  });

  // Handle Quote Form Submit (Sends filled message directly to WhatsApp)
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName')?.value.trim() || '';
      const phone = document.getElementById('modalPhone')?.value.trim() || '';
      const email = document.getElementById('modalEmail')?.value.trim() || '';
      const service = document.getElementById('modalService')?.value || 'Sports Infrastructure Construction';
      const location = document.getElementById('modalLocation')?.value.trim() || '';

      let text = `Hi Solai Sports Infra, I would like to request a construction quote:%0A%0A`;
      if (name) text += `*Full Name:* ${encodeURIComponent(name)}%0A`;
      if (phone) text += `*Mobile Number:* ${encodeURIComponent(phone)}%0A`;
      if (email) text += `*Email:* ${encodeURIComponent(email)}%0A`;
      if (service) text += `*Service Required:* ${encodeURIComponent(service)}%0A`;
      if (location) text += `*Project Location:* ${encodeURIComponent(location)}%0A`;

      // Launch WhatsApp with filled message text
      window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
      showNotification(`Thank you ${name || 'Valued Customer'}! Opening WhatsApp with your project details...`);
      closeQuoteModal();
      modalForm.reset();
    });
  }

  // Handle Direct WhatsApp Chat button inside Modal Form
  if (btnModalWhatsApp) {
    btnModalWhatsApp.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName')?.value.trim() || '';
      const phone = document.getElementById('modalPhone')?.value.trim() || '';
      const email = document.getElementById('modalEmail')?.value.trim() || '';
      const service = document.getElementById('modalService')?.value || 'Sports Infrastructure Construction';
      const location = document.getElementById('modalLocation')?.value.trim() || '';

      let text = `Hi Solai Sports Infra, I would like to chat about a sports construction project:%0A%0A`;
      if (name) text += `*Full Name:* ${encodeURIComponent(name)}%0A`;
      if (phone) text += `*Mobile Number:* ${encodeURIComponent(phone)}%0A`;
      if (email) text += `*Email:* ${encodeURIComponent(email)}%0A`;
      if (service) text += `*Service:* ${encodeURIComponent(service)}%0A`;
      if (location) text += `*Location:* ${encodeURIComponent(location)}%0A`;

      window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
      closeQuoteModal();
      if (modalForm) modalForm.reset();
    });
  }

  // Mobile Carousel Touch Swipe & Dot Controller
  const carousel = document.querySelector('.mobile-cards-carousel');
  const dots = document.querySelectorAll('.mobile-dots .dot');
  const mobileCardsList = document.querySelectorAll('.mobile-sport-card');
  window.isUserTouchingMobileCarousel = false;
  let touchTimeout = null;

  if (carousel) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const setTouching = () => {
      window.isUserTouchingMobileCarousel = true;
      if (touchTimeout) clearTimeout(touchTimeout);
    };

    const resetTouching = () => {
      if (touchTimeout) clearTimeout(touchTimeout);
      touchTimeout = setTimeout(() => {
        window.isUserTouchingMobileCarousel = false;
      }, 500);
    };

    carousel.addEventListener('touchstart', setTouching, { passive: true });
    carousel.addEventListener('touchmove', setTouching, { passive: true });
    carousel.addEventListener('touchend', resetTouching, { passive: true });

    carousel.addEventListener('mousedown', (e) => {
      setTouching();
      isDown = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => { isDown = false; resetTouching(); });
    carousel.addEventListener('mouseup', () => { isDown = false; resetTouching(); });

    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      carousel.scrollLeft = scrollLeft - walk;
    });

    // Scroll & Touch Swipe Listener — calculate nearest centered card
    carousel.addEventListener('scroll', () => {
      const carouselCenter = carousel.scrollLeft + (carousel.offsetWidth / 2);
      let closestIdx = 0;
      let minDistance = Infinity;

      mobileCardsList.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
        const distance = Math.abs(carouselCenter - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === closestIdx) dot.classList.add('active');
        else dot.classList.remove('active');
      });

      mobileCardsList.forEach((card, idx) => {
        if (idx === closestIdx) card.classList.add('active', 'featured');
        else card.classList.remove('active', 'featured');
      });

      if (typeof window.heroGoToSlide === 'function' && window.heroCurrentIndex !== closestIdx) {
        window.heroGoToSlide(closestIdx);
      }
    }, { passive: true });

    // Allow clicking card directly to smooth scroll center and change slide
    mobileCardsList.forEach((card, idx) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const scrollTarget = card.offsetLeft - (carousel.offsetWidth / 2) + (card.offsetWidth / 2);
        carousel.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
        if (typeof window.heroGoToSlide === 'function') {
          window.heroGoToSlide(idx);
        }
      });
    });

    // Dot click smooth navigation
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        const targetCard = mobileCardsList[idx];
        if (targetCard) {
          const scrollTarget = targetCard.offsetLeft - (carousel.offsetWidth / 2) + (targetCard.offsetWidth / 2);
          carousel.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
          if (typeof window.heroGoToSlide === 'function') {
            window.heroGoToSlide(idx);
          }
        }
      });
    });
  }

  // Custom Toast Notification Helper
  function showNotification(message) {
    let existingToast = document.querySelector('.custom-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  /* ==========================================================================
     THE GAME UNFOLDS — 4-STAGE CINEMATIC SCROLL ANIMATION (Desktop & Mobile)
     ========================================================================== */
  function initUnfoldsScrollAnimation() {
    const track = document.getElementById('unfoldsTrack');
    const header = document.getElementById('unfoldsHeader');
    const centerVideo = document.getElementById('unfoldsCenterVideo');
    const playBadge = document.getElementById('unfoldsPlayBadge');
    const finalHeadline = document.getElementById('unfoldsFinalHeadline');
    const scrollHint = document.getElementById('unfoldsScrollHint');

    const card1 = document.getElementById('unfoldsCard1'); // Cricket (Top-Left ↖)
    const card2 = document.getElementById('unfoldsCard2'); // Football (Top-Right ↗)
    const card3 = document.getElementById('unfoldsCard3'); // Indoor (Bottom-Left ↙)
    const card4 = document.getElementById('unfoldsCard4'); // Turf (Bottom-Right ↘)

    if (!track || !centerVideo || window.innerWidth <= 768) return;

    let ticking = false;

    function updateAnimation() {
      const rect = track.getBoundingClientRect();
      const trackHeight = track.offsetHeight - window.innerHeight;

      if (trackHeight <= 0) return;

      // Calculate scroll progress p between 0.0 and 1.0
      let p = -rect.top / trackHeight;
      p = Math.max(0, Math.min(1, p));

      const isMobile = window.innerWidth <= 768;

      // --- STAGE 1 & 2: DIAGONAL CARDS EXPANSION ---
      const maxMoveVW = isMobile ? 55 : 48; // Max horizontal shift in vw
      const maxMoveVH = isMobile ? 50 : 42; // Max vertical shift in vh
      const moveVW = p * maxMoveVW;
      const moveVH = p * maxMoveVH;
      const opacity = p > 0.4 ? Math.max(0, 1 - (p - 0.4) * 3.5) : 1;

      // Card 01: Cricket (Top-Left ↖)
      if (card1) {
        const rot = -8 - p * 12;
        card1.style.transform = `translate3d(${-moveVW}vw, ${-moveVH}vh, 0) rotate(${rot}deg)`;
        card1.style.opacity = opacity;
      }

      // Card 02: Football (Top-Right ↗)
      if (card2) {
        const rot = 8 + p * 12;
        card2.style.transform = `translate3d(${moveVW}vw, ${-moveVH}vh, 0) rotate(${rot}deg)`;
        card2.style.opacity = opacity;
      }

      // Card 03: Indoor (Bottom-Left ↙)
      if (card3) {
        const rot = -6 - p * 12;
        card3.style.transform = `translate3d(${-moveVW}vw, ${moveVH}vh, 0) rotate(${rot}deg)`;
        card3.style.opacity = opacity;
      }

      // Card 04: Turf (Bottom-Right ↘)
      if (card4) {
        const rot = 6 + p * 12;
        card4.style.transform = `translate3d(${moveVW}vw, ${moveVH}vh, 0) rotate(${rot}deg)`;
        card4.style.opacity = opacity;
      }

      // --- STAGE 3 & 4: CENTER VIDEO TRANSFORM (Circle ◯ -> Rounded Fullscreen ▭) ---
      const initialSize = isMobile ? 220 : 340;
      const targetWidth = isMobile ? window.innerWidth * 0.94 : window.innerWidth * 0.90;
      const targetHeight = isMobile ? window.innerHeight * 0.75 : window.innerHeight * 0.78;

      const currentWidth = initialSize + p * (targetWidth - initialSize);
      const currentHeight = initialSize + p * (targetHeight - initialSize);
      const borderRadius = Math.max(20, 50 - p * 45);

      centerVideo.style.width = `${currentWidth}px`;
      centerVideo.style.height = `${currentHeight}px`;
      centerVideo.style.borderRadius = `${borderRadius}%`;

      if (p > 0.5) {
        centerVideo.style.borderColor = `rgba(22, 163, 74, ${Math.min(1, (p - 0.5) * 2)})`;
        centerVideo.style.boxShadow = `0 0 ${30 + p * 30}px rgba(22, 163, 74, 0.4)`;
      } else {
        centerVideo.style.borderColor = '#16A34A';
      }

      // Fades & Transitions
      if (header) {
        header.style.opacity = Math.max(0, 1 - p * 3.5);
        header.style.transform = `translate(-50%, ${-p * 40}px)`;
      }

      if (playBadge) {
        playBadge.style.opacity = Math.max(0, 1 - p * 4);
      }

      if (scrollHint) {
        scrollHint.style.opacity = Math.max(0, 1 - p * 5);
      }

      // Final Headline Reveal
      if (finalHeadline) {
        if (p > 0.65) {
          finalHeadline.classList.add('active');
          const headlineOpacity = Math.min(1, (p - 0.65) * 3);
          finalHeadline.style.opacity = headlineOpacity;
        } else {
          finalHeadline.classList.remove('active');
          finalHeadline.style.opacity = 0;
        }
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateAnimation);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      onScroll();
    });

    // Initial trigger
    updateAnimation();
  }

  initUnfoldsScrollAnimation();

  /* ==========================================================================
     TESTIMONIALS SLIDER INTERACTIVITY
     ========================================================================== */
  function initTestimonialSlider() {
    const testimonials = [
      {
        quote: "“Excellent work done by solai team. They fullfill our needs. Using very good quality products and nice installation.”",
        name: "Shyambalaji Nagarajan",
        role: "Google Review",
        avatar: "assets/boy_porfile.jpg",
        stars: "★★★★★"
      },
      {
        quote: "“The installation team came and did a perfect job on my ground floor, ensuring everything was laid out neatly without any hassle. The area now looks much more attractive, green, and lively. Overall, I’m extremely satisfied with both the product and service, and I would surely recommend it to anyone planning to buy an artificial grass mat.”",
        name: "Puneet Srivastava",
        role: "Google Review",
        avatar: "assets/boy_porfile.jpg",
        stars: "★★★★★"
      },
      {
        quote: "“Thank you Solai and team for the best works done in one of my residence projects. As an architect I would recommend solai for their best competitive rates and on time project delivery.”",
        name: "Terry Mike",
        role: "Architect | Google Review",
        avatar: "assets/boy_porfile.jpg",
        stars: "★★★★★"
      },
      {
        quote: "“Really impressed with the quality of this artificial turf. The grass looks natural, durable, and low maintenance. Perfect for my garden and easy to install. Highly recommend this turf company for premium artificial grass.”",
        name: "Gourav Tandon",
        role: "Google Review",
        avatar: "assets/girl_profile.jpg",
        stars: "★★★★★"
      },
      {
        quote: "“Thanks to solai for completing my home project grass fixing on time,even tho they had a busy schedule the workers worked at night and completed it”",
        name: "Roshan Singh",
        role: "Google Review",
        avatar: "assets/boy_porfile.jpg",
        stars: "★★★★★"
      }
    ];

    let currentIdx = 0;
    const quoteEl = document.getElementById('testiQuote');
    const nameEl = document.getElementById('testiName');
    const roleEl = document.getElementById('testiRole');
    const avatarEl = document.getElementById('testiAvatar');
    const starsEl = document.getElementById('testiStars');
    const counterEl = document.getElementById('testiCurrentNum');
    const prevBtn = document.getElementById('testiPrevBtn');
    const nextBtn = document.getElementById('testiNextBtn');
    const dots = document.querySelectorAll('#testiDots .testi-dot');
    const stackCards = document.querySelectorAll('#testiPhotoStack .stack-card');

    if (!quoteEl || !nameEl) return;

    function updateStackCards(activeIndex) {
      if (!stackCards.length) return;
      const total = stackCards.length;

      stackCards.forEach((card, i) => {
        card.classList.remove('card-front', 'card-mid', 'card-back', 'card-hidden', 'card-exit');

        const relPos = (i - activeIndex + total) % total;

        if (relPos === 0) {
          card.classList.add('card-front');
        } else if (relPos === 1) {
          card.classList.add('card-mid');
        } else if (relPos === 2) {
          card.classList.add('card-back');
        } else if (relPos === total - 1) {
          card.classList.add('card-exit');
        } else {
          card.classList.add('card-hidden');
        }
      });
    }

    function renderTestimonial(index) {
      currentIdx = index;
      const data = testimonials[currentIdx];

      // Update right side card stack positions
      updateStackCards(currentIdx);

      // Smooth fade transition
      quoteEl.style.opacity = '0';
      nameEl.style.opacity = '0';

      setTimeout(() => {
        quoteEl.innerText = data.quote;
        nameEl.innerText = data.name;
        roleEl.innerText = data.role;
        if (avatarEl) {
          if (data.avatar) {
            avatarEl.src = data.avatar;
            avatarEl.alt = data.name;
            avatarEl.style.display = 'block';
          } else {
            avatarEl.style.display = 'none';
          }
        }
        starsEl.innerText = data.stars;
        counterEl.innerText = String(currentIdx + 1).padStart(2, '0');

        quoteEl.style.opacity = '1';
        nameEl.style.opacity = '1';
      }, 150);

      dots.forEach((dot, idx) => {
        if (idx === currentIdx) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const nextIdx = (currentIdx - 1 + testimonials.length) % testimonials.length;
        renderTestimonial(nextIdx);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const nextIdx = (currentIdx + 1) % testimonials.length;
        renderTestimonial(nextIdx);
      });
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        renderTestimonial(idx);
      });
    });

    // Auto-slide every 6 seconds
    setInterval(() => {
      const nextIdx = (currentIdx + 1) % testimonials.length;
      renderTestimonial(nextIdx);
    }, 6000);
  }

  initTestimonialSlider();

  /* ==========================================================================
     FAQ ACCORDION INTERACTIVITY
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-item-header');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(i => {
          i.classList.remove('active');
          const icon = i.querySelector('.faq-toggle-icon');
          if (icon) icon.textContent = '+';
        });

        // Toggle current item
        if (!isOpen) {
          item.classList.add('active');
          const icon = item.querySelector('.faq-toggle-icon');
          if (icon) icon.textContent = '−';
        }
      });
    }
  });

  /* ==========================================================================
     GALLERY / OUR PROJECTS SLIDER INTERACTIVITY
     ========================================================================== */
  function initGallerySlider() {
    const prevBtn = document.querySelector('#gallery .btn-slider-prev');
    const nextBtn = document.querySelector('#gallery .btn-slider-next');
    const mainImg = document.querySelector('#gallery .gallery-main-card-bg');
    const mainVideo = document.querySelector('#gallery .gallery-main-card-video');
    const mainTag = document.querySelector('#gallery .main-tag-left');
    const notchTag = document.querySelector('#galleryNotchTag');
    const counterEl = document.querySelector('#gallery .main-counter-right');
    const fillLine = document.querySelector('#gallery .progress-fill-line');
    const currentNumEl = document.querySelector('#gallery .slider-progress-wrapper .progress-num:first-child');
    const totalNumEl = document.querySelector('#gallery .slider-progress-wrapper .progress-num:last-child');
    const quoteText = document.querySelector('#gallery .quote-text');
    const quoteAuthor = document.querySelector('#gallery .quote-author');
    const sideCards = document.querySelectorAll('#gallery .gallery-card-sm');

    if (!prevBtn || !nextBtn || (!mainImg && !mainVideo)) return;

    const galleryData = [
      {
        tag: 'CRICKET TURF',
        video: 'assets/home/cricket_normal.mp4',
        poster: 'assets/home/hero_cricket.png',
        quote: '"Outstanding craftsmanship! The sub-base drainage and turf quality are top notch."',
        author: '— SPORTS CLUB OWNER',
        sides: [
          { tag: 'FOOTBALL ARENA', img: 'assets/home/hero_football.png' },
          { tag: 'PICKLEBALL COURT', img: 'assets/home/her0_pickelball.png' },
          { tag: 'PADEL COURT', img: 'assets/home/hero_padel.png' },
          { tag: 'BADMINTON COURT', img: 'assets/home/hero_badminaton.png' }
        ]
      },
      {
        tag: 'FOOTBALL ARENA',
        video: 'assets/home/Football_normal.mp4',
        poster: 'assets/home/hero_football.png',
        quote: '"State of the art 7-a-side pitch with high density monofilament turf. Players love it!"',
        author: '— ARENA MANAGER, CHENNAI',
        sides: [
          { tag: 'PICKLEBALL COURT', img: 'assets/home/her0_pickelball.png' },
          { tag: 'PADEL COURT', img: 'assets/home/hero_padel.png' },
          { tag: 'CRICKET TURF', img: 'assets/home/hero_cricket.png' },
          { tag: 'BADMINTON COURT', img: 'assets/home/hero_badminaton.png' }
        ]
      },
      {
        tag: 'PICKLEBALL COURT',
        video: 'assets/home/pickelball_normal.mp4',
        poster: 'assets/home/her0_pickelball.png',
        quote: '"8-layer acrylic cushion surface gave our academy world-class court pacing."',
        author: '— ACADEMY DIRECTOR',
        sides: [
          { tag: 'PADEL COURT', img: 'assets/home/hero_padel.png' },
          { tag: 'CRICKET TURF', img: 'assets/home/hero_cricket.png' },
          { tag: 'FOOTBALL ARENA', img: 'assets/home/hero_football.png' },
          { tag: 'BADMINTON COURT', img: 'assets/home/hero_badminaton.png' }
        ]
      },
      {
        tag: 'PADEL COURT',
        video: 'assets/home/padels_normal.mp4',
        poster: 'assets/home/hero_padel.png',
        quote: '"Seamless panoramic glass padel courts installed flawlessly for our sports complex."',
        author: '— CLUB DEVELOPER',
        sides: [
          { tag: 'CRICKET TURF', img: 'assets/home/hero_cricket.png' },
          { tag: 'FOOTBALL ARENA', img: 'assets/home/hero_football.png' },
          { tag: 'PICKLEBALL COURT', img: 'assets/home/her0_pickelball.png' },
          { tag: 'BADMINTON COURT', img: 'assets/home/hero_badminaton.png' }
        ]
      }
    ];

    let currentIdx = 0;
    let isAnimating = false;
    const total = galleryData.length;

    function renderSlide(index, direction = 'next') {
      if (isAnimating) return;
      isAnimating = true;
      currentIdx = index;
      const data = galleryData[currentIdx];

      const shiftOutX = direction === 'next' ? -25 : 25;
      const shiftInX = direction === 'next' ? 25 : -25;

      // Phase 1: Slide Out & Fade Out
      if (mainVideo) {
        mainVideo.style.transition = 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease';
        mainVideo.style.opacity = '0';
        mainVideo.style.transform = `scale(1.05) translateX(${shiftOutX}px)`;
      }

      if (mainImg) {
        mainImg.style.transition = 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease';
        mainImg.style.opacity = '0';
        mainImg.style.transform = `scale(1.05) translateX(${shiftOutX}px)`;
      }

      if (quoteText) {
        quoteText.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        quoteText.style.opacity = '0';
        quoteText.style.transform = 'translateY(6px)';
      }

      sideCards.forEach(card => {
        const imgEl = card.querySelector('img');
        if (imgEl) {
          imgEl.style.transition = 'opacity 0.2s ease';
          imgEl.style.opacity = '0.3';
        }
      });

      setTimeout(() => {
        // Phase 2: Update content & prepare incoming video/image
        if (mainVideo && data.video) {
          if (data.poster) mainVideo.poster = data.poster;
          mainVideo.src = data.video;
          mainVideo.load();
          mainVideo.play().catch(() => { });
        }
        if (mainImg && data.mainImg) {
          mainImg.src = data.mainImg;
        }

        if (mainTag) mainTag.innerText = data.tag;
        if (notchTag) notchTag.innerText = data.tag;
        if (counterEl) counterEl.innerText = `${String(currentIdx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
        if (currentNumEl) currentNumEl.innerText = String(currentIdx + 1).padStart(2, '0');
        if (totalNumEl) totalNumEl.innerText = String(total).padStart(2, '0');
        if (fillLine) fillLine.style.width = `${((currentIdx + 1) / total) * 100}%`;

        if (quoteText) quoteText.innerText = data.quote;
        if (quoteAuthor) quoteAuthor.innerText = data.author;

        if (data.sides && sideCards.length >= 4) {
          sideCards.forEach((card, idx) => {
            if (data.sides[idx]) {
              const imgEl = card.querySelector('img');
              const tagEl = card.querySelector('.gallery-card-tag');
              if (imgEl) imgEl.src = data.sides[idx].img;
              if (tagEl) tagEl.innerText = data.sides[idx].tag;
            }
          });
        }

        // Set position for incoming slide
        if (mainVideo) {
          mainVideo.style.transition = 'none';
          mainVideo.style.transform = `scale(1.05) translateX(${shiftInX}px)`;
        }
        if (mainImg) {
          mainImg.style.transition = 'none';
          mainImg.style.transform = `scale(1.05) translateX(${shiftInX}px)`;
        }

        // Force reflow
        if (mainVideo) void mainVideo.offsetHeight;
        if (mainImg) void mainImg.offsetHeight;

        // Phase 3: Slide In & Fade In
        if (mainVideo) {
          mainVideo.style.transition = 'transform 0.38s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease';
          mainVideo.style.opacity = '1';
          mainVideo.style.transform = 'scale(1) translateX(0)';
        }
        if (mainImg) {
          mainImg.style.transition = 'transform 0.38s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease';
          mainImg.style.opacity = '1';
          mainImg.style.transform = 'scale(1) translateX(0)';
        }

        if (quoteText) {
          quoteText.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          quoteText.style.opacity = '1';
          quoteText.style.transform = 'translateY(0)';
        }

        sideCards.forEach(card => {
          const imgEl = card.querySelector('img');
          if (imgEl) {
            imgEl.style.opacity = '1';
          }
        });

        setTimeout(() => {
          isAnimating = false;
        }, 380);
      }, 220);
    }

    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const nextIdx = (currentIdx - 1 + total) % total;
      renderSlide(nextIdx, 'prev');
    });

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const nextIdx = (currentIdx + 1) % total;
      renderSlide(nextIdx, 'next');
    });

    // Allow clicking side cards to jump to selected project
    sideCards.forEach((card) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const tagEl = card.querySelector('.gallery-card-tag');
        if (tagEl) {
          const targetTag = tagEl.innerText.trim();
          const targetIdx = galleryData.findIndex(g => g.tag === targetTag);
          const dir = targetIdx >= currentIdx ? 'next' : 'prev';
          if (targetIdx !== -1) {
            renderSlide(targetIdx, dir);
          } else {
            renderSlide((currentIdx + 1) % total, 'next');
          }
        }
      });
    });

    // Initial render
    renderSlide(0, 'next');
  }

  initGallerySlider();
});


