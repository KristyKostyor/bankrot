document.addEventListener('DOMContentLoaded', function () {
  console.log('[FORM VALIDATION] script loaded');
  const RECAPTCHA_SITE_KEY = '6LdvbeQrAAAAAIPL3Fh7-GwonJTuruR67gGqHbPo';

  const form = document.querySelector('.contact__content');
  if (!form) {
    console.warn('[FORM VALIDATION] .contact__content not found');
    return;
  }

  // защита от двойного подключения
  if (form.__handlerAttached) {
    console.log('[FORM VALIDATION] handler already attached');
    return;
  }
  form.__handlerAttached = true;

  const button = form.querySelector('.contact__btn');
  const phoneInput = form.querySelector('#phone') || form.querySelector('input[name="tel"]');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    e.stopImmediatePropagation(); // блокируем другие обработчики
    console.log('[FORM VALIDATION] submit captured');

    // Honeypot — защита от ботов
    const gotcha = form.querySelector('input[name="_gotcha"]');
    if (gotcha && gotcha.value.trim() !== '') {
      console.warn('[FORM VALIDATION] Honeypot triggered — возможный бот');
      return;
    }

    if (!phoneInput) {
      alert('Поле телефона не найдено. Добавьте id="phone" или name="tel".');
      return;
    }

    // Чистим номер и проверяем
    const raw = phoneInput.value.trim();
    const digits = raw.replace(/\D/g, ''); // оставляем только цифры
    console.log('[FORM VALIDATION] digits=', digits);

    if (!((digits.length === 10) || (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')))) {
      alert('Введите корректный номер: +7XXXXXXXXXX или 8XXXXXXXXXX');
      phoneInput.focus();
      return;
    }

    // Отправляем цель в Яндекс.Метрику
    try {
      if (typeof ym === 'function') {
        ym(99960670, 'reachGoal', 'form_submit');
      }
    } catch (err) {
      console.warn('ym error', err);
    }

    // Меняем кнопку во время отправки
    if (button) {
      button.disabled = true;
      button.textContent = 'Отправка...';
    }

    try {
      const data = new FormData(form);
       // 🧩 ВСТАВЛЯЕМ reCAPTCHA ТУТ ↓↓↓
       const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' });
       data.append('g-recaptcha-response', token);
       // 🧩 конец блока reCAPTCHA
      const response = await fetch(form.action, {
        method: form.method || 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });

      console.log('[FORM VALIDATION] fetch status=', response.status);

      if (response.ok) {
        window.location.href = 'https://bezdolgov.netlify.app/spasibo.html';
      } else {
        const text = await response.text();
        console.error('[FORM VALIDATION] Formspree error', response.status, text);
        alert('Ошибка при отправке формы. Попробуйте снова.');
      }
    } catch (err) {
      console.error('[FORM VALIDATION] Network error', err);
      alert('Сетевая ошибка. Попробуйте позже.');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = 'Отправить';
      }
    }
  }, true); // capture = true
});
