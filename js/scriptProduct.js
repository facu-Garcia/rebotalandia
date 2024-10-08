document.addEventListener('DOMContentLoaded', () => {
    const pageTitle = document.title.trim().toLowerCase();
    fetch('../../data/catalogo.json')
        .then(response => response.json())
        .then(data => {
            const producto = data.find(item => item.name.toLowerCase().includes(pageTitle));

            if (producto) {
                document.title = producto.name;

                const container = document.getElementById('container__product');
                container.innerHTML = `
                    <div class="gallery">
                        <div class="gallery__main">
                            <img id="main-image" src="../${producto.image}" alt="${producto.name}">
                        </div>
                        <div class="gallery__extras">
                            <div id="prev" class="carrousel-button" style="display: none;">
                                <span class="material-symbols-rounded">chevron_left</span>
                            </div>
                            ${Object.keys(producto.gallery).map((key, index) => `
                                <img src="${producto.gallery[key]}" alt="${producto.name} ${key}" class="gallery__thumbnail" data-index="${index}">
                            `).join('')}
                            <div id="next" class="carrousel-button" style="display: none;">
                                <span class="material-symbols-rounded">chevron_right</span>
                            </div>
                        </div>
                    </div>
                    <div class="info"> 
                        <div class="title">
                            <h1>${producto.name}</h1>
                        </div>
                        <p class="price">Rentalo por <br> <strong>$${producto.price}</strong></p>
                        <a class="info__data" href="https://wa.me/525611788454?text=${encodeURIComponent(`Hola, estoy interesado(a) en el inflable ${producto.name}. ¿Podrías darme más detalles sobre la disponibilidad y el proceso de renta? Gracias.`)}" target="_blank">
                            <i class="fab fa-whatsapp fa-2xl"></i>
                            <p>Pidelo ya!</p>
                        </a>
                        <div class="data">
                            <div class="data__item">
                                <div class="item__title">
                                    <span class="material-symbols-rounded">straighten</span>
                                    <strong>Largo</strong>
                                </div>
                                <p>${producto.dimensions.length}</p>
                            </div>
                            <div class="data__item">  
                                <div class="item__title">                              
                                    <span class="material-symbols-rounded">width</span>
                                    <strong>Ancho</strong>
                                </div>
                                <p>${producto.dimensions.width}</p>
                            </div>
                            <div class="data__item">
                                <div class="item__title">   
                                    <span class="material-symbols-rounded">height</span>
                                    <strong>Alto</strong>
                                </div>
                                <p>${producto.dimensions.height}</p>
                            </div>
                            <div class="data__item">
                                <div class="item__title">   
                                    <span class="material-symbols-rounded">person</span>
                                    <strong>Recom.</strong>
                                </div>
                                <p>${producto.recommended}</p>
                            </div>
                        </div>
                        <p class="description">${producto.description}</p>
                        
                    </div>
                    <div class="recommend">
                        <h2>Tambien te podría interesar</h2>
                        <div class="recommend__products"></div>
                    </div>
                    `;

                const recommendContainer = document.querySelector('.recommend__products');

                const productosRestantes = data.filter(item => item.link.toLowerCase() !== producto.link.toLowerCase());

                const productosAleatorios = [];
                while (productosAleatorios.length < 3 && productosRestantes.length > 0) {
                    const randomIndex = Math.floor(Math.random() * productosRestantes.length);
                    const productoAleatorio = productosRestantes.splice(randomIndex, 1)[0];
                    productosAleatorios.push(productoAleatorio);
                }

                productosAleatorios.forEach(recomendado => {
                    const productoHTML = `
                            <div class="catalog__item">
                                <div class="background" style="background: url(../${recomendado.hover}) no-repeat top center / cover"></div>            
                                <a class="item__content" href="${recomendado.link}">
                                    <div class="image" style="background: url(../${recomendado.image}) no-repeat center center / contain"></div>
                                    <h3>${recomendado.name}</h3>
                                    <p><b>${recomendado.price}</b></p>
                                </a>

                                <div class="info__link">
                                    <a class="info__data" href="https://wa.me/525611788454?text=${encodeURIComponent(`Hola, estoy interesado(a) en el inflable ${recomendado.name}. ¿Podrías darme más detalles sobre la disponibilidad y el proceso de renta? Gracias.`)}" target="_blank">                                     
                                        <i class="fab fa-whatsapp fa-lg"></i>
                                        <p>Pidelo ya!</p>
                                    </a>
                                </div>
                            </div>
                        `;
                    recommendContainer.innerHTML += productoHTML;
                });

                const thumbnails = document.querySelectorAll('.gallery__thumbnail');
                const mainImage = document.getElementById('main-image');
                const modal = document.getElementById('modal');
                const modalImage = document.getElementById('modal-image');
                const closeModalButton = document.getElementById('close-modal');

                let currentIndex = 0;

                thumbnails.forEach((thumbnail, index) => {
                    thumbnail.addEventListener('click', () => {
                        updateMainImage(index);
                    });
                });

                function updateMainImage(index) {
                    mainImage.src = thumbnails[index].src; 
                    currentIndex = index; 
                    updateNavButtons(); 
                    updateThumbnailSelection();
                    scrollToThumbnail(index); 
                }

                function updateNavButtons() {
                    const prevButton = document.getElementById('prev');
                    const nextButton = document.getElementById('next');

                    if (currentIndex === 0) {
                        prevButton.style.display = 'none';
                    } else {
                        prevButton.style.display = 'flex'; 
                    }

                    if (currentIndex === thumbnails.length - 1) {
                        nextButton.style.display = 'none'; 
                    } else {
                        nextButton.style.display = 'flex'; 
                    }
                }

                function updateThumbnailSelection() {
                    thumbnails.forEach(thumbnail => thumbnail.classList.remove('selected'));
                    thumbnails[currentIndex].classList.add('selected'); 
                }
                
                function scrollToThumbnail(index) {
                    const thumbnail = thumbnails[index];
                    const thumbnailsContainer = document.querySelector('.gallery__extras');
                    const thumbnailWidth = thumbnail.offsetWidth;
                    const offset = thumbnail.offsetLeft - (thumbnailsContainer.offsetWidth / 2) + (thumbnailWidth / 2);

                    thumbnailsContainer.scrollTo({
                        left: offset,
                        behavior: 'smooth'
                    });
                }

                updateNavButtons();
                updateThumbnailSelection();

                mainImage.addEventListener('click', () => {
                    modal.style.display = 'flex';
                    modalImage.src = mainImage.src; 
                });

                closeModalButton.addEventListener('click', () => {
                    modal.style.display = 'none';
                    modalImage.style.transform = 'scale(1)'; 
                });

                modal.addEventListener('click', () => {
                    modal.style.display = 'none';
                    modalImage.style.transform = 'scale(1)';
                });

                // Zoom en la imagen del modal al hacer clic
                modalImage.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                });

                document.getElementById('prev').addEventListener('click', () => {
                    if (currentIndex > 0) {
                        currentIndex--; 
                        updateMainImage(currentIndex);
                    }
                });

                document.getElementById('next').addEventListener('click', () => {
                    if (currentIndex < thumbnails.length - 1) {
                        currentIndex++; 
                        updateMainImage(currentIndex);
                    }
                });

            } else {
                const container = document.getElementById('container__product');
                container.innerHTML = `<p>Producto no encontrado.</p>`;
            }
        })
        .catch(error => {
            console.error('Error al cargar el JSON:', error);
        });
});