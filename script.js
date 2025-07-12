document.addEventListener('DOMContentLoaded', () => {
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  let current = 0;
  let isThrottled = false;

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
    reveals.forEach((el, i) => {
      const floatingCard = el.querySelector('.floating-card');
      const featureItems = el.querySelectorAll('.feature-item');
      
      if (i === idx) {
        el.classList.remove('hidden');
        el.classList.add('flex');
        el.style.transition = 'none';
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px) scale(0.98)';
        // Делаем фон прозрачным
        el.style.background = 'transparent';
        // Меняем фон у bgFade
        const bgClass = Array.from(el.classList).find(cls => bgMap[cls]);
        if (bgClass && bgFade) {
          bgFade.style.background = bgMap[bgClass];
        }
        
        // Анимация для floating-card
        if (floatingCard) {
          floatingCard.classList.remove('animate-in');
          setTimeout(() => {
            floatingCard.classList.add('animate-in');
          }, 300);
        }
        
        // Анимация для feature-items с задержкой
        featureItems.forEach((item, index) => {
          item.classList.remove('animate-in');
          setTimeout(() => {
            item.classList.add('animate-in');
          }, 500 + index * 150);
        });
        
        setTimeout(() => {
          el.style.transition = 'opacity 1.0s cubic-bezier(.4,0,.2,1), transform 1.0s cubic-bezier(.4,0,.2,1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
        }, 20);
      } else {
        if (!el.classList.contains('hidden')) {
          el.style.transition = 'opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)';
          el.style.opacity = '0';
          el.style.transform = 'translateY(-40px) scale(0.98)';
          el.style.background = 'transparent';
          
          // Убираем анимации
          if (floatingCard) floatingCard.classList.remove('animate-in');
          featureItems.forEach(item => item.classList.remove('animate-in'));
          
          setTimeout(() => {
            el.classList.add('hidden');
            el.classList.remove('flex');
            el.style.opacity = '';
            el.style.transform = '';
            el.style.transition = '';
          }, 700);
        } else {
          el.classList.add('hidden');
          el.classList.remove('flex');
          el.style.opacity = '';
          el.style.transform = '';
          el.style.transition = '';
          el.style.background = 'transparent';
          
          // Убираем анимации
          if (floatingCard) floatingCard.classList.remove('animate-in');
          featureItems.forEach(item => item.classList.remove('animate-in'));
        }
      }
    });
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