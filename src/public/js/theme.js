const btn = document.getElementById('themeBtn');
const icon = document.getElementById('themeIcon');
const html = document.documentElement;

btn.addEventListener('click', () => {
    if (html.getAttribute('data-bs-theme') === 'light') {
        html.setAttribute('data-bs-theme', 'dark');
        icon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
        btn.style.backgroundColor = '#ffc107'; btn.style.color = '#000'; btn.style.borderColor = '#fff';
    } else {
        html.setAttribute('data-bs-theme', 'light');
        icon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
        btn.style.backgroundColor = '#000'; btn.style.color = '#ffc107'; btn.style.borderColor = '#000';
    }
});