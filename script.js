document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".contact__content");
    const button = form.querySelector(".contact__btn");
  
    if (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const data = new FormData(form);
  
        // меняем кнопку
        button.disabled = true;
        button.textContent = "Отправка...";
  
        try {
          let response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: { Accept: "application/json" }
          });
  
          if (response.ok) {
            window.location.href = "https://bezdolgov.netlify.app/spasibo.html";
          } else {
            alert("Ошибка при отправке формы. Попробуйте снова.");
            button.disabled = false;
            button.textContent = "Отправить";
          }
        } catch (error) {
          alert("Сетевая ошибка. Попробуйте позже.");
          button.disabled = false;
          button.textContent = "Отправить";
        }
      });
    }
  });
  