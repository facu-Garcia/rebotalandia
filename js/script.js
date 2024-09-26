document.addEventListener('DOMContentLoaded', () => {
    // NAVBAR
    const navLinks = document.querySelector('.nav__links');
    document.getElementById('menu').addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });


});