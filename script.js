document.addEventListener('DOMContentLoaded', () => {
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  let current = 0;
  let isThrottled = false;

  // Индикаторы (точки) — вертикально справа, по центру
  const dots = document.createElement('div');
  dots.className = 'fixed top-1/2 right-6 -translate-y-1/2 flex flex-col gap-3 z-50';
  dots.innerHTML = reveals.map((_, i) => `<span class="dot w-4 h-4 rounded-full bg-white/40 border-2 border-white transition-all duration-300 block cursor-pointer"></span>`).join('');
  document.body.appendChild(dots);
  const dotEls = Array.from(dots.querySelectorAll('.dot'));

  // Кликабельность точек
  dotEls.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      current = i;
      showSlide(current);
    });
  });

  function showSlide(idx) {
    reveals.forEach((el, i) => {
      if (i === idx) {
        el.classList.remove('hidden');
        el.classList.add('flex');
        // Плавная анимация появления (медленнее)
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px) scale(0.98)';
        setTimeout(() => {
          el.style.transition = 'opacity 1.3s cubic-bezier(.4,0,.2,1), transform 1.3s cubic-bezier(.4,0,.2,1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
        }, 10);
      } else {
        el.classList.add('hidden');
        el.classList.remove('flex');
        el.style.opacity = '';
        el.style.transform = '';
        el.style.transition = '';
      }
    });
    dotEls.forEach((dot, i) => {
      dot.classList.toggle('bg-white', i === idx);
      dot.classList.toggle('bg-white/40', i !== idx);
      dot.classList.toggle('scale-125', i === idx);
    });
  }

  // Смена слайдов при прокрутке колесом мыши (без порога)
  window.addEventListener('wheel', (e) => {
    if (isThrottled) return;
    if (e.deltaY > 0) {
      current = (current + 1) % reveals.length;
      showSlide(current);
    } else if (e.deltaY < 0) {
      current = (current - 1 + reveals.length) % reveals.length;
      showSlide(current);
    }
    isThrottled = true;
    setTimeout(() => isThrottled = false, 1400);
  }, { passive: false });

  // Смена слайдов свайпом на мобильных (порог 40px)
  let touchStartY = null;
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
    }
  });
  window.addEventListener('touchend', (e) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY - touchEndY;
    if (Math.abs(diffY) > 40) {
      if (diffY > 0) {
        current = (current + 1) % reveals.length;
        showSlide(current);
      } else {
        current = (current - 1 + reveals.length) % reveals.length;
        showSlide(current);
      }
    }
    touchStartY = null;
  });

  // Изначально показываем только первый блок
  reveals.forEach((el, i) => {
    if (i !== 0) el.classList.add('hidden');
    else el.classList.add('flex');
    el.style.opacity = '';
    el.style.transform = '';
    el.style.transition = '';
  });
  showSlide(0);
}); 