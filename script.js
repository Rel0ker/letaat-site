document.addEventListener('DOMContentLoaded', () => {
  const animated = document.querySelectorAll('.animate-fade-in, .animate-slide-in-left, .animate-slide-in-right');
  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    animated.forEach(el => {
      const revealTop = el.getBoundingClientRect().top;
      if (revealTop < windowHeight - 60) {
        el.style.animationPlayState = 'running';
      }
    });
  }
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();
});

