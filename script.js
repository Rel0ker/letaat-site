document.addEventListener('DOMContentLoaded', () => {
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  let current = 0;
  let isThrottled = false;
  let lastSlide = 0;

  // Проверяем, что мы на ПК (ширина экрана больше 768px)
  const isDesktop = window.innerWidth > 768;
  
  // Если мы на мобильном, не инициализируем слайды
  if (!isDesktop) {
    // Показываем все секции на мобильных
    reveals.forEach(el => {
      el.classList.remove('hidden');
      el.classList.add('flex');
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.background = 'transparent';
      el.style.transition = 'none';
    });
    
    // Показываем все анимированные элементы
    const floatingCards = document.querySelectorAll('.floating-card');
    const featureItems = document.querySelectorAll('.feature-item');
    
    floatingCards.forEach(card => {
      card.classList.add('animate-in');
    });
    
    featureItems.forEach(item => {
      item.classList.add('animate-in');
    });
    
    // Удаляем dots, showSlide и логику слайдов
    const dots = document.querySelector('.dots-container');
    if (dots) dots.remove();
    window.showSlide = undefined;
    return; // Выходим из функции
  }

  // Индикаторы (точки) — только для десктопа
  const dots = document.createElement('div');
  dots.className = 'dots-container';
  dots.style.cssText = `
    position: fixed;
    top: 50%;
    right: 1.5rem;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    z-index: 50;
  `;
  
  dots.innerHTML = reveals.map((_, i) => `<span class="dot"></span>`).join('');
  document.body.appendChild(dots);
  const dotEls = Array.from(dots.querySelectorAll('.dot'));

  // Кликабельность точек
  dotEls.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      current = i;
      showSlide(current);
    });
  });

  const bgMap = {
    'slide-bg-main-blue': 'radial-gradient(ellipse 75vw 100vh at center bottom, #2d5a4a 0%, #0a2233 20%)',
    'slide-bg-main-green': 'linear-gradient(135deg, #4b9b7a 60%, #0a2233 100%)',
    'slide-bg-soft': 'linear-gradient(120deg, #1a2a2f 60%, #0a2233 100%)',
  };
  const bgFade = document.getElementById('slide-bg-fade');

  function showSlide(idx) {
    const direction = idx > lastSlide ? 1 : -1;
    reveals.forEach((el, i) => {
      if (i === idx) {
        el.classList.remove('hidden');
        el.classList.add('flex');
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = '';
        el.style.background = 'transparent';
        el.style.display = 'flex';
      } else {
        el.classList.add('hidden');
        el.classList.remove('flex');
        el.style.opacity = '';
        el.style.transform = '';
        el.style.transition = '';
        el.style.background = 'transparent';
        el.style.display = '';
      }
      // Анимация главной иконки
      const heroIcon = el.querySelector('.icon-bg-hero');
      if (heroIcon) {
        if (i === idx) {
          heroIcon.classList.add('animate-in');
        } else {
          heroIcon.classList.remove('animate-in');
        }
      }
    });

    const newEl = reveals[idx];
    const oldEl = reveals[lastSlide];

    if (newEl !== oldEl) {
      newEl.style.transition = 'none';
      newEl.style.opacity = '0';
      newEl.style.transform = `translateY(${direction * 40}px) scale(0.98)`;
      setTimeout(() => {
        newEl.style.transition = 'opacity 1.0s cubic-bezier(.4,0,.2,1), transform 1.0s cubic-bezier(.4,0,.2,1)';
        newEl.style.opacity = '1';
        newEl.style.transform = 'translateY(0) scale(1)';
      }, 20);

      oldEl.style.transition = 'opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)';
      oldEl.style.opacity = '0';
      oldEl.style.transform = `translateY(${-direction * 40}px) scale(0.98)`;
      setTimeout(() => {
        oldEl.classList.add('hidden');
        oldEl.classList.remove('flex');
        oldEl.style.opacity = '';
        oldEl.style.transform = '';
        oldEl.style.transition = '';
        oldEl.style.display = '';
      }, 700);
    }
    lastSlide = idx;
    dotEls.forEach((dot, i) => {
      if (i === idx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Смена слайдов при прокрутке колесом мыши (только на десктопе)
  window.addEventListener('wheel', (e) => {
    if (isThrottled || !isDesktop) return;
    if (e.deltaY > 0.75 && current < reveals.length - 1) {
      current++;
      showSlide(current);
    } else if (e.deltaY < -0.75 && current > 0) {
      current--;
      showSlide(current);
    }
    isThrottled = true;
    setTimeout(() => isThrottled = false, 1400);
  }, { passive: false });

  // Смена слайдов свайпом на мобильных (только на десктопе)
  let touchStartY = null;
  window.addEventListener('touchstart', (e) => {
    if (!isDesktop) return;
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
    }
  });
  window.addEventListener('touchend', (e) => {
    if (!isDesktop || touchStartY === null) return;
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

  // Mouse glow effect для .floating-card и .feature-item (только на десктопе)
  if (window.innerWidth > 768) {
    const glowBlocks = document.querySelectorAll('.floating-card, .feature-item');
    glowBlocks.forEach(block => {
      const glow = block.querySelector('.mouse-glow');
      if (!glow) return;
      block.addEventListener('mousemove', e => {
        const rect = block.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
        glow.classList.add('active');
      });
      block.addEventListener('mouseleave', () => {
        glow.classList.remove('active');
      });
    });
  }

  // Изначально показываем только первый блок
  reveals.forEach((el, i) => {
    if (i !== 0) el.classList.add('hidden');
    else el.classList.add('flex');
    el.style.opacity = '';
    el.style.transform = '';
    el.style.transition = '';
  });
  showSlide(0);

  // --- Современный аккордеон с анимацией и автоскроллом ---
  document.querySelectorAll('.accordion').forEach(acc => {
    acc.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', function() {
        const item = this.closest('.accordion-item');
        const open = item.classList.contains('open');
        // Закрыть все
        acc.querySelectorAll('.accordion-item').forEach(i => {
          i.classList.remove('open');
          const body = i.querySelector('.accordion-body');
          if (body) {
            body.style.maxHeight = null;
          }
        });
        // Открыть только если не был открыт
        if (!open) {
          item.classList.add('open');
          const body = item.querySelector('.accordion-body');
          if (body) {
            body.style.maxHeight = body.scrollHeight + 'px';
          }
          setTimeout(() => {
            const headerEl = document.querySelector('header');
            const headerHeight = headerEl ? headerEl.offsetHeight : 70;
            const rect = item.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetY = rect.top + scrollTop - headerHeight - 8;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
          }, 350);
        }
      });
    });
  });

  // Удаляю дублирующийся блок создания dots и updateDots
  // (Блок ниже удалён)
  /*
  const oldSliderRail = document.querySelector('.slider-rail');
  if (oldSliderRail) oldSliderRail.remove();

  const sliderDotsContainer = document.createElement('div');
  sliderDotsContainer.className = 'dots-container';
  sliderDotsContainer.style.cssText = `
    position: fixed;
    top: 50%;
    right: 1.5rem;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    z-index: 50;
  `;
  sliderDotsContainer.innerHTML = reveals.map((_, i) => `<span class="dot"></span>`).join('');
  document.body.appendChild(sliderDotsContainer);
  const sliderDotEls = Array.from(sliderDotsContainer.querySelectorAll('.dot'));
  sliderDotEls.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (current !== i) {
        current = i;
        showSlide(current);
      }
    });
  });
  function updateDots() {
    sliderDotEls.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }
  // Вызов обновления при смене слайда
  const origShowSlide = showSlide;
  showSlide = function(idx) {
    origShowSlide(idx);
    updateDots();
  };
  */

  // Добавляю функцию updateDots и вызываю её внутри showSlide
  // function updateDots() {
  //   dotEls.forEach((dot, i) => {
  //     dot.classList.toggle('active', i === current);
  //   });
  // }

  // Модифицирую showSlide, чтобы вызывать updateDots
  // const origShowSlide = showSlide;
  // showSlide = function(idx) {
  //   origShowSlide(idx);
  //   updateDots();
  // };
}); 