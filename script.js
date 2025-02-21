
function callUser() {
    let phoneNumber = prompt("Введите ваш номер телефона:");
    if (phoneNumber) {
        window.location.href = "tel:" + phoneNumber;
    }
}
