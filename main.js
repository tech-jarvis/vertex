/* Vertex BDC — Shared JavaScript */
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.navbar__links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => observer.observe(el));
  }

  const particleContainer = document.querySelector('.hero__particles');
  if (particleContainer) {
    for (let i = 0; i < 30; i++) {
      const span = document.createElement('span');
      span.style.left = Math.random() * 100 + '%';
      span.style.top = (Math.random() * 100 + 100) + '%';
      span.style.width = span.style.height = (Math.random() * 4 + 2) + 'px';
      span.style.animationDuration = (Math.random() * 10 + 8) + 's';
      span.style.animationDelay = (Math.random() * 8) + 's';
      particleContainer.appendChild(span);
    }
  }

  const carousel = document.getElementById('heroCarousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel__slide');
    const dots = carousel.querySelectorAll('.carousel__dot');
    const prevBtn = carousel.querySelector('.carousel__arrow--prev');
    const nextBtn = carousel.querySelector('.carousel__arrow--next');
    let current = 0;
    let autoTimer = null;
    const INTERVAL = 6000;

    function goToSlide(index) {
      slides.forEach(s => {
        s.classList.remove('active');
        const content = s.querySelector('.hero__content');
        if (content) content.classList.remove('hero__content--enter');
      });
      dots.forEach(d => d.classList.remove('active'));
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      const activeContent = slides[current].querySelector('.hero__content');
      if (activeContent) {
        void activeContent.offsetHeight;
        activeContent.classList.add('hero__content--enter');
      }
    }
    function nextSlide() { goToSlide(current + 1); }
    function prevSlide() { goToSlide(current - 1); }
    function startAutoPlay() { stopAutoPlay(); autoTimer = setInterval(nextSlide, INTERVAL); }
    function stopAutoPlay() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.getAttribute('data-slide'), 10));
        startAutoPlay();
      });
    });
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prevSlide(); startAutoPlay(); }
      if (e.key === 'ArrowRight') { nextSlide(); startAutoPlay(); }
    });
    let touchStartX = 0, touchEndX = 0;
    carousel.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) { if (diff > 0) nextSlide(); else prevSlide(); startAutoPlay(); }
    }, { passive: true });
    startAutoPlay();
  }

  const currentPath = window.location.pathname;
  document.querySelectorAll('.navbar__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    if ((href === '/' || href === 'index.html') && (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '')) link.classList.add('active');
    else if (href !== '/' && currentPath.includes(href)) link.classList.add('active');
  });

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) { input.style.borderColor = '#e53935'; valid = false; } else { input.style.borderColor = ''; }
      });
      const emailInput = form.querySelector('[type="email"]');
      if (emailInput && emailInput.value && !/^\S+@\S+\.\S+$/.test(emailInput.value)) { emailInput.style.borderColor = '#e53935'; valid = false; }
      if (!valid) return;

      const payload = {
        dealership: form.querySelector('#dealership').value.trim(),
        contactName: form.querySelector('#contactName').value.trim(),
        email: form.querySelector('#email').value.trim(),
        phone: form.querySelector('#phone').value.trim(),
        leadVolume: form.querySelector('#leadVolume').value,
        crm: form.querySelector('#crm').value,
        message: form.querySelector('#message').value.trim()
      };

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      submitBtn.style.opacity = '.7';

      try {
        const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const result = await res.json();
        if (result.success) {
          form.innerHTML = `
            <div style="text-align:center;padding:3rem 1rem;">
              <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#2CBDAA,#24a090);display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 style="margin-bottom:.5rem;">Thank You!</h3>
              <p style="color:#64748b;margin:0 auto;">We've received your request. A Vertex BDC specialist will be in touch within 24 hours.</p>
            </div>
          `;
        } else {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.opacity = '1';
          alert(result.error || 'Something went wrong. Please try again.');
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';
        alert('Network error. Please check your connection and try again.');
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const region = document.getElementById(btn.getAttribute('aria-controls'));
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.faq-item__question');
        const otherRegion = otherBtn && document.getElementById(otherBtn.getAttribute('aria-controls'));
        if (otherRegion) otherRegion.hidden = true;
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        if (region) region.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Newsletter form (no backend — show thank you)
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[name="email"]');
      if (!email || !email.value.trim()) return;
      newsletterForm.innerHTML = '<p class="newsletter-strip__thanks" style="margin:0;color:var(--slate-300);font-size:1rem;">Thanks for subscribing. We\'ll be in touch.</p>';
    });
  }
});
