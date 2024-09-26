document.addEventListener('DOMContentLoaded', () => {
    // CARRUSEL
    const items = document.querySelectorAll('.carousel__item');
    const carouselContainer = document.getElementById('carousel-container');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    let current = 0;

    const gradients = {
        'rainbow-slide': 'linear-gradient(45deg, var(--primary-600), var(--primary-800))',
        'castillo-gusano': 'linear-gradient(45deg, var(--secondary-600), var(--secondary-800))',
        'diversion-arcoiris': 'linear-gradient(45deg, var(--green-700), var(--green-900))'
    };

    const buttonColors = {
        'rainbow-slide': 'var(--primary-400)',
        'castillo-gusano': 'var(--secondary-400)',
        'diversion-arcoiris': 'var(--green-400)'
    };

    const updateBackgroundGradient = (newGradient) => {
        const newBackground = document.createElement('div');
        newBackground.style.position = 'absolute';
        newBackground.style.top = 0;
        newBackground.style.left = 0;
        newBackground.style.right = 0;
        newBackground.style.bottom = 0;
        newBackground.style.maxHeight = '1500px';
        newBackground.style.background = newGradient;
        newBackground.style.zIndex = '-1';
        newBackground.style.opacity = '0';
        newBackground.style.transition = 'opacity 0.8s ease-in-out';
        carouselContainer.appendChild(newBackground);

        window.getComputedStyle(newBackground).opacity; 
        newBackground.style.opacity = '1';

        setTimeout(() => {
            const oldBackgrounds = carouselContainer.querySelectorAll('div[style]');
            if (oldBackgrounds.length > 1) {
                oldBackgrounds[0].remove();
            }
        }, 800);
    };
    
    const updateButtonBackground = (newColor) => {
        prevButton.style.backgroundColor = newColor;
        nextButton.style.backgroundColor = newColor;
    };
    const updateBackgroundColor = () => {
        const activeItem = items[current];
        const className = Array.from(activeItem.classList).find(cls => gradients[cls]);
        if (className) {
            updateBackgroundGradient(gradients[className]);
            updateButtonBackground(buttonColors[className]);
        }
    };

    const updateCarousel = () => {
        items.forEach(item => item.classList.remove('active', 'left', 'right'));
        items[current].classList.add('active');
        items[(current - 1 + items.length) % items.length].classList.add('left');
        items[(current + 1) % items.length].classList.add('right');
        updateBackgroundColor();
    };

    updateCarousel();

    nextButton.addEventListener('click', () => {
        current = (current + 1) % items.length;
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        current = (current - 1 + items.length) % items.length;
        updateCarousel();
    });
});