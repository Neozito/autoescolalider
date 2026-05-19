// ========================================
// AUTOESCOLA LÍDER - MAIN SCRIPTS
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // === HEADER SCROLL ===
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

  // === MOBILE NAV ===
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');

  function openMobile() {
    mobileNav.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeMobile() {
    mobileNav.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMobile);
  if (mobileClose) mobileClose.addEventListener('click', closeMobile);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobile);

  // === MOBILE ACCORDION ===
  document.querySelectorAll('.mobile-accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.classList.toggle('open');
    });
  });

  // === DROPDOWN (touch support) ===
  document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = toggle.closest('.nav-dropdown');
      document.querySelectorAll('.nav-dropdown').forEach(d => {
        if (d !== parent) d.classList.remove('active');
      });
      parent.classList.toggle('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('active'));
    }
  });

  // === SCROLL ANIMATIONS ===
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    fadeEls.forEach(el => observer.observe(el));
  }

  // === FORM HANDLING ===
  const form = document.getElementById('contatoForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = form.querySelector('#nome')?.value || '';
      const telefone = form.querySelector('#telefone')?.value || '';
      const categoria = form.querySelector('#categoria')?.value || '';
      const mensagem = form.querySelector('#mensagem')?.value || '';

      let text = `Olá! Vim pelo site e gostaria de informações.%0A`;
      text += `*Nome:* ${nome}%0A`;
      if (telefone) text += `*Telefone:* ${telefone}%0A`;
      if (categoria) text += `*Interesse:* ${categoria}%0A`;
      if (mensagem) text += `*Mensagem:* ${mensagem}%0A`;

      window.open(`https://wa.me/5545998334100?text=${text}`, '_blank');
    });
  }

  // === PHONE MASK ===
  const phoneInput = document.getElementById('telefone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 11) val = val.slice(0, 11);
      if (val.length > 6) {
        val = `(${val.slice(0,2)}) ${val.slice(2,3)} ${val.slice(3,7)}-${val.slice(7)}`;
      } else if (val.length > 2) {
        val = `(${val.slice(0,2)}) ${val.slice(2)}`;
      }
      e.target.value = val;
    });
  }

  // === LIGHTBOX / IMAGE GALLERY ===
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');

  if (lightbox) {
    let galleryImages = [];
    let currentIndex = 0;

    // Collect all clickable gallery images on the page
    function collectImages() {
      galleryImages = [];
      // Gallery items (estrutura, galeria sections)
      document.querySelectorAll('.gallery-item img').forEach(img => galleryImages.push(img));
      // Frota images
      document.querySelectorAll('.frota-img img').forEach(img => galleryImages.push(img));
      // Any other section images that should be zoomable (not logos, icons, etc.)
      document.querySelectorAll('.page-content img, .landing-img img').forEach(img => {
        if (!galleryImages.includes(img)) galleryImages.push(img);
      });
    }

    function openLightbox(index) {
      collectImages();
      if (galleryImages.length === 0) return;
      currentIndex = index;
      updateLightbox();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightboxFn() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function updateLightbox() {
      const img = galleryImages[currentIndex];
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
      lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
      // Hide arrows if only 1 image
      lightboxPrev.style.display = galleryImages.length <= 1 ? 'none' : 'flex';
      lightboxNext.style.display = galleryImages.length <= 1 ? 'none' : 'flex';
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      updateLightbox();
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightbox();
    }

    // Click events
    lightboxClose.addEventListener('click', closeLightboxFn);
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);

    // Close on overlay click (not on image)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightboxFn();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightboxFn();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });

    // Touch swipe support
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) prevImage();
        else nextImage();
      }
    }, { passive: true });

    // Attach click handlers to all gallery images
    function attachLightboxClicks() {
      collectImages();
      galleryImages.forEach((img, i) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(i);
        });
      });
    }

    attachLightboxClicks();
  }

});
