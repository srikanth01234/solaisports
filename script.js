document.addEventListener('DOMContentLoaded', () => {
  // Navigation Pill Active State Switch
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
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

  // Sports Cards Interactivity (Desktop & Mobile)
  const sportsCards = document.querySelectorAll('.sports-card, .mobile-sport-card');
  sportsCards.forEach(card => {
    card.addEventListener('click', () => {
      const sportName = card.getAttribute('data-sport');
      showNotification(`Selected: ${sportName} - Click 'Book Your Slot' to reserve!`);
    });
  });

  /* ==========================================================================
     HERO SECTION DYNAMIC BACKGROUND SLIDESHOW (3-SECOND ROTATION)
     ========================================================================== */
  function initHeroSlideshow() {
    const layer1 = document.getElementById('heroBgLayer1');
    const layer2 = document.getElementById('heroBgLayer2');
    const allSportsCards = document.querySelectorAll('.sports-card, .mobile-sport-card');

    if (!layer1 || !layer2) return;

    // Collect slides based on desktop sports cards
    const desktopCards = Array.from(document.querySelectorAll('.sports-card'));
    if (desktopCards.length === 0) return;

    const slides = desktopCards.map(card => {
      const img = card.querySelector('img');
      const sportName = card.getAttribute('data-sport');
      let src = img ? img.src : '';
      if (src.includes('unsplash.com')) {
        src = src.replace('w=400', 'w=2000').replace('q=80', 'q=85');
      }
      return {
        sport: sportName,
        image: src
      };
    });

    // Preload slide images
    slides.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
    });

    let currentIndex = 0;
    let activeLayer = layer1;
    let inactiveLayer = layer2;
    let slideshowTimer = null;

    // Set initial background image
    activeLayer.style.backgroundImage = `url('${slides[0].image}')`;
    activeLayer.classList.add('active');
    updateActiveCardStates(slides[0].sport);

    function updateActiveCardStates(sportName) {
      allSportsCards.forEach(card => {
        if (card.getAttribute('data-sport') === sportName) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    }

    function goToSlide(index) {
      if (index === currentIndex) return;

      const nextSlide = slides[index];
      currentIndex = index;

      // Prepare inactive layer background image
      inactiveLayer.style.backgroundImage = `url('${nextSlide.image}')`;

      // Smooth CSS opacity cross-fade
      inactiveLayer.classList.add('active');
      activeLayer.classList.remove('active');

      // Swap active layer references
      const temp = activeLayer;
      activeLayer = inactiveLayer;
      inactiveLayer = temp;

      // Highlight corresponding sports card
      updateActiveCardStates(nextSlide.sport);
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

    // Attach click listeners to cards for instant switch & timer reset
    allSportsCards.forEach(card => {
      card.addEventListener('click', () => {
        const sportName = card.getAttribute('data-sport');
        const slideIndex = slides.findIndex(s => s.sport === sportName);
        if (slideIndex !== -1) {
          goToSlide(slideIndex);
          startTimer(); // Reset 3s cycle on user click
        }
      });
    });

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

  // Auto-popup after 4 seconds on initial visit
  setTimeout(() => {
    if (!sessionStorage.getItem('solai_modal_shown')) {
      openQuoteModal();
      sessionStorage.setItem('solai_modal_shown', 'true');
    }
  }, 4000);

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

  // Mobile Carousel Dots scroll listener
  const carousel = document.querySelector('.mobile-cards-carousel');
  const dots = document.querySelectorAll('.mobile-dots .dot');

  if (carousel && dots.length > 0) {
    carousel.addEventListener('scroll', () => {
      const scrollPos = carousel.scrollLeft;
      const cardWidth = 184; // Card width + gap
      const activeIdx = Math.min(Math.floor(scrollPos / cardWidth), dots.length - 1);
      dots.forEach((dot, idx) => {
        if (idx === activeIdx) dot.classList.add('active');
        else dot.classList.remove('active');
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
     THE GAME UNFOLDS — 4-STAGE CINEMATIC SCROLL ANIMATION
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

      // Calculate scroll progress p between 0.0 and 1.0
      let p = -rect.top / trackHeight;
      p = Math.max(0, Math.min(1, p));

      // --- STAGE 1 & 2: DIAGONAL CARDS EXPANSION ---
      const moveVW = p * 48; // Max horizontal shift in vw
      const moveVH = p * 42; // Max vertical shift in vh
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
      const initialSize = 340;
      const targetWidth = window.innerWidth * 0.90;
      const targetHeight = window.innerHeight * 0.78;

      const currentWidth = initialSize + p * (targetWidth - initialSize);
      const currentHeight = initialSize + p * (targetHeight - initialSize);
      const borderRadius = Math.max(28, 50 - p * 45);

      centerVideo.style.width = `${currentWidth}px`;
      centerVideo.style.height = `${currentHeight}px`;
      centerVideo.style.borderRadius = `${borderRadius}%`;

      if (p > 0.5) {
        centerVideo.style.borderColor = `rgba(140, 247, 22, ${Math.min(1, (p - 0.5) * 2)})`;
        centerVideo.style.boxShadow = `0 0 ${40 + p * 30}px rgba(140, 247, 22, 0.4)`;
      } else {
        centerVideo.style.borderColor = '#8CF716';
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
      if (window.innerWidth <= 768) {
        // Reset styles for mobile
        if (centerVideo) {
          centerVideo.style.width = '';
          centerVideo.style.height = '';
          centerVideo.style.borderRadius = '';
        }
      }
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
        quote: "“Solai Infra built our 7-a-side football turf with precision sub-base drainage and FIFA-standard grass. Completed right on schedule!”",
        name: "Arun Prakash",
        role: "Sports Club Owner",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        stars: "★★★★★"
      },
      {
        quote: "“Our professional pickleball courts were constructed with flawless acrylic cushion surfacing. Excellent bounce and pace!”",
        name: "Divya S",
        role: "Academy Director",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        stars: "★★★★★"
      },
      {
        quote: "“Exceptional work on our school's multi-sport synthetic flooring and LED floodlight towers. Durable and top-quality finish!”",
        name: "Karthik Raja",
        role: "School Sports Head",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        stars: "★★★★★"
      },
      {
        quote: "“Constructed a box cricket turf with heavy-duty perimeter netting for our venture. Highly professional engineering team!”",
        name: "Sneha Reddy",
        role: "Turf Entrepreneur",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        stars: "★★★★★"
      },
      {
        quote: "“From site survey to final surface installation, Solai delivered our private villa pickleball court with top aesthetics!”",
        name: "Vikram Menon",
        role: "Private Property Owner",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
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

    if (!quoteEl || !nameEl || !avatarEl) return;

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
        avatarEl.src = data.avatar;
        avatarEl.alt = data.name;
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
});


