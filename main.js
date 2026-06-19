// Lightweight portfolio interactions.
document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initNavigation();
  initCounters();
  initContactForm();
  initResponsiveFeatures();
  initEmailObfuscation();
  initSectionRevealAnimations();
  initTestimonials();
});

function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  document.body.classList.add("overflow-hidden");

  const hidePreloader = () => {
    preloader.classList.add("loader-hidden");
    document.body.classList.remove("overflow-hidden");
    window.setTimeout(() => preloader.remove(), 400);
  };

  if (document.readyState === "complete") {
    window.setTimeout(hidePreloader, 250);
  } else {
    window.addEventListener("load", () => window.setTimeout(hidePreloader, 250), { once: true });
    window.setTimeout(hidePreloader, 1600);
  }
}

function initNavigation() {
  const navbar = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".nav-link");
  const navbarCollapse = document.querySelector(".navbar-collapse");
  if (!navbar) return;

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) return;

      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;

      event.preventDefault();
      const offsetTop = targetSection.offsetTop - navbar.offsetHeight + 1;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
      navbarCollapse?.classList.remove("show");
    });
  });

  const onScroll = debounce(() => {
    navbar.classList.toggle("navbar-scrolled", window.scrollY > 40);
    updateActiveNavigation();
  }, 30);

  window.addEventListener("scroll", onScroll);
  onScroll();
}

function updateActiveNavigation() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const scrollPosition = window.scrollY + 180;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
      });
    }
  });
}

function initCounters() {
  const counters = document.querySelectorAll(".counter");
  const statsSection = document.getElementById("statistics");
  if (!counters.length || !statsSection) return;

  let animated = false;
  const animateCounters = () => {
    if (animated) return;
    animated = true;

    counters.forEach((counter) => {
      const target = Number.parseInt(counter.getAttribute("data-count"), 10);
      if (Number.isNaN(target)) return;

      const hasPlus = counter.textContent.includes("+");
      const duration = 900;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(target * progress);
        counter.textContent = `${value}${hasPlus ? "+" : ""}`;

        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      animateCounters();
      observer.disconnect();
    }
  }, { threshold: 0.35 });

  observer.observe(statsSection);
}

function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    if (!name || !email || !subject || !message) {
      showFormMessage("Please fill in all fields.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showFormMessage("Please enter a valid email address.", "error");
      return;
    }

    showFormMessage("Sending...", "info");

    fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Form submission failed");
        showFormMessage("Thank you. Your message has been sent successfully.", "success");
        contactForm.reset();
      })
      .catch(() => {
        showFormMessage("There was an error sending your message. Please try again.", "error");
      });
  });
}

function showFormMessage(message, type) {
  const formResponse = document.getElementById("form-response");
  if (!formResponse) return;

  formResponse.textContent = message;
  formResponse.className = `form-response ${type}`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function initResponsiveFeatures() {
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.id = "scrollTopBtn";
  scrollTopBtn.className = "scroll-top-btn";
  scrollTopBtn.setAttribute("aria-label", "Scroll to top");
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
  document.body.appendChild(scrollTopBtn);

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", debounce(() => {
    scrollTopBtn.style.display = window.scrollY > 420 ? "grid" : "none";
  }, 100));
}

function initEmailObfuscation() {
  document.querySelectorAll(".email-obfuscated").forEach((link) => {
    const user = link.getAttribute("data-user");
    const domain = link.getAttribute("data-domain");
    if (!user || !domain) return;

    const email = `${user}@${domain}`;
    link.textContent = email;
    link.setAttribute("href", `mailto:${email}`);
  });
}

function initSectionRevealAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const elements = document.querySelectorAll(
    ".skill-category-card, .project-card-new, .timeline-item, .stat-card, .community-card, .blog-card, .testimonial, .about-glass-card, .contact-card-new, .contact-form-card-new"
  );

  elements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(18px)";
    element.style.transition = "opacity 520ms ease, transform 520ms ease";
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  elements.forEach((element) => observer.observe(element));
}

function initTestimonials() {
  const testimonials = document.querySelectorAll(".testimonial");
  const prevBtn = document.getElementById("prev-testimonial");
  const nextBtn = document.getElementById("next-testimonial");
  if (!testimonials.length || !prevBtn || !nextBtn) return;

  let current = 0;
  const show = (index) => {
    testimonials.forEach((item, itemIndex) => {
      item.classList.toggle("active", itemIndex === index);
    });
  };

  prevBtn.addEventListener("click", () => {
    current = (current - 1 + testimonials.length) % testimonials.length;
    show(current);
  });

  nextBtn.addEventListener("click", () => {
    current = (current + 1) % testimonials.length;
    show(current);
  });
}

function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
