document.addEventListener('DOMContentLoaded', function () {
  console.log('[FORM VALIDATION] script loaded');
  const RECAPTCHA_SITE_KEY = '6LdvbeQrAAAAAIPL3Fh7-GwonJTuruR67gGqHbPo';

  const form = document.querySelector('.contact__content');
  if (!form) return;

  if (form.__handlerAttached) return;
  form.__handlerAttached = true;

  const button = form.querySelector('.contact__btn');
  const phoneInput = form.querySelector('#phone') || form.querySelector('input[name="tel"]');

  // контейнер для ошибок
  const errorBox = document.createElement('div');
  errorBox.classList.add('contact__error');
  phoneInput.insertAdjacentElement('afterend', errorBox);

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    errorBox.textContent = '';
    errorBox.classList.remove('visible');

    // honeypot
    const gotcha = form.querySelector('input[name="_gotcha"]');
    if (gotcha && gotcha.value.trim() !== '') return;

    // проверка телефона
    const raw = phoneInput.value.trim();
    const digits = raw.replace(/\D/g, '');
    if (!((digits.length === 10) || (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')))) {
      errorBox.textContent = 'Введите корректный номер: +7XXXXXXXXXX или 8XXXXXXXXXX';
      errorBox.classList.add('visible');
      phoneInput.focus();
      return;
    }

    // цель в Метрику
    try {
      if (typeof ym === 'function') ym(99960670, 'reachGoal', 'form_submit');
    } catch (err) {}

    // блокировка кнопки
    if (button) {
      button.disabled = true;
      button.innerHTML = '⏳ Отправка...';
    }

    try {
      const data = new FormData(form);

      // reCAPTCHA
      const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' });
      data.append('g-recaptcha-response', token);

      const response = await fetch(form.action, {
        method: form.method || 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        button.innerHTML = '✅ Отправлено!';
        setTimeout(() => (window.location.href = 'https://bezdolgov.netlify.app/spasibo.html'), 600);
      } else {
        errorBox.textContent = 'Ошибка при отправке. Попробуйте позже.';
        errorBox.classList.add('visible');
      }
    } catch (err) {
      console.error(err);
      errorBox.textContent = 'Сетевая ошибка. Попробуйте позже.';
      errorBox.classList.add('visible');
    } finally {
      setTimeout(() => {
        button.disabled = false;
        button.innerHTML = 'Отправить';
      }, 2500);
    }
  });
});
