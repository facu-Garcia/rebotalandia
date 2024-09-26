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
                        <p class="price">Rentalo por <br> ${producto.price}</p>
                        <a href="si" class="info__data">
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

                // Aquí empieza la sección de recomendaciones
                const recommendContainer = document.querySelector('.recommend__products');

                // Filtrar el catálogo para evitar incluir el producto actual
                const productosRestantes = data.filter(item => item.link.toLowerCase() !== producto.link.toLowerCase());

                // Seleccionar 3 productos aleatorios
                const productosAleatorios = [];
                while (productosAleatorios.length < 3 && productosRestantes.length > 0) {
                    const randomIndex = Math.floor(Math.random() * productosRestantes.length);
                    const productoAleatorio = productosRestantes.splice(randomIndex, 1)[0];
                    productosAleatorios.push(productoAleatorio);
                }

                // Insertar los productos aleatorios en el DOM
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
                                    <a href="si" class="info__data">
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

                // Variable para rastrear el índice de la imagen actual
                let currentIndex = 0;

                // Cambiar la imagen principal al hacer clic en una miniatura
                thumbnails.forEach((thumbnail, index) => {
                    thumbnail.addEventListener('click', () => {
                        updateMainImage(index);
                    });
                });

                // Función para actualizar la imagen principal y la miniatura seleccionada
                function updateMainImage(index) {
                    mainImage.src = thumbnails[index].src; // Cambia la imagen principal
                    currentIndex = index; // Actualiza el índice actual
                    updateNavButtons(); // Actualiza la visibilidad de los botones
                    updateThumbnailSelection(); // Actualiza la selección de miniaturas
                    scrollToThumbnail(index); // Desplaza el carrusel a la miniatura seleccionada
                }

                // Función para actualizar la visibilidad de los botones de navegación
                function updateNavButtons() {
                    const prevButton = document.getElementById('prev');
                    const nextButton = document.getElementById('next');

                    if (currentIndex === 0) {
                        prevButton.style.display = 'none'; // Ocultar el botón de "Previo"
                    } else {
                        prevButton.style.display = 'flex'; // Mostrar el botón de "Previo"
                    }

                    if (currentIndex === thumbnails.length - 1) {
                        nextButton.style.display = 'none'; // Ocultar el botón de "Siguiente"
                    } else {
                        nextButton.style.display = 'flex'; // Mostrar el botón de "Siguiente"
                    }
                }

                // Función para actualizar la selección de miniaturas
                function updateThumbnailSelection() {
                    thumbnails.forEach(thumbnail => thumbnail.classList.remove('selected')); // Quitar la clase de selección de todas las miniaturas
                    thumbnails[currentIndex].classList.add('selected'); // Añadir la clase de selección a la miniatura actual
                }

                // Función para desplazar el carrusel a la miniatura seleccionada
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

                // Inicializar la visibilidad de los botones de navegación
                updateNavButtons();
                updateThumbnailSelection();

                // Mostrar el modal al hacer clic en la imagen principal
                mainImage.addEventListener('click', () => {
                    modal.style.display = 'flex';
                    modalImage.src = mainImage.src; // Establecer la imagen ampliada
                });

                // Cerrar el modal al hacer clic en la X o fuera de la imagen
                closeModalButton.addEventListener('click', () => {
                    modal.style.display = 'none';
                    modalImage.style.transform = 'scale(1)'; // Restablecer zoom al cerrar
                });

                modal.addEventListener('click', () => {
                    modal.style.display = 'none';
                    modalImage.style.transform = 'scale(1)'; // Restablecer zoom al cerrar
                });

                // Zoom en la imagen del modal al hacer clic
                modalImage.addEventListener('click', (e) => {
                    if (modalImage.style.transform === 'scale(2)') {
                        modalImage.style.transform = 'scale(1)'; // Reducir
                    } else {
                        modalImage.style.transform = 'scale(2)'; // Ampliar
                    }
                    e.stopPropagation(); // Evita que se cierre el modal al hacer clic en la imagen
                });

                // Navegar a la imagen anterior
                document.getElementById('prev').addEventListener('click', () => {
                    if (currentIndex > 0) {
                        currentIndex--; // Decrementa el índice
                        updateMainImage(currentIndex); // Actualiza la imagen principal y la selección
                    }
                });

                // Navegar a la imagen siguiente
                document.getElementById('next').addEventListener('click', () => {
                    if (currentIndex < thumbnails.length - 1) {
                        currentIndex++; // Incrementa el índice
                        updateMainImage(currentIndex); // Actualiza la imagen principal y la selección
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