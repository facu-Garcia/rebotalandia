document.addEventListener('DOMContentLoaded', () => {
    // NAVBAR
    const navLinks = document.querySelector('.nav__links');
    document.getElementById('menu').addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    let lastScrollPosition = 0;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScrollPosition > lastScrollPosition) {
            header.style.top = '-100%';
            navLinks.classList.remove('active');
        } else {
            header.style.top = '0';
        }
        lastScrollPosition = currentScrollPosition;
    });
});