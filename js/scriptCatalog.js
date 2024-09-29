document.addEventListener('DOMContentLoaded', () => {
    const nombreInput = document.getElementById('nombre');
    const precioSelect = document.getElementById('precio');

    // Agregar eventos para los filtros
    nombreInput.addEventListener('input', filtrarCatalogo);
    precioSelect.addEventListener('change', filtrarCatalogo);

    // Cargar el catálogo al inicio
    fetch('../data/catalogo.json')
        .then(response => response.json())
        .then(data => {
            window.catalogData = data;
            mostrarCatalogo(data);
        })
        .catch(error => {
            console.error('Error al cargar el JSON:', error);
        });
});

function filtrarCatalogo() {
    const nombreFiltro = document.getElementById('nombre').value.toLowerCase();
    const precioFiltro = document.getElementById('precio').value;

    const filtrados = window.catalogData.filter(item => {
        const nombreIncluye = item.name.toLowerCase().includes(nombreFiltro);
        const precioNumerico = parseFloat(item.price.replace(',', ''));

        let precioIncluye = false;

        if (precioFiltro === 'todos') {
            precioIncluye = true;
        } else if (precioFiltro === 'menor1000' && precioNumerico < 1000) {
            precioIncluye = true;
        } else if (precioFiltro === '1000-2000' && precioNumerico >= 1000 && precioNumerico <= 2000) {
            precioIncluye = true;
        } else if (precioFiltro === 'mayor2000' && precioNumerico > 2000) {
            precioIncluye = true;
        }

        return nombreIncluye && precioIncluye;
    });

    mostrarCatalogo(filtrados);
}

function mostrarCatalogo(data) {
    const catalogContainer = document.getElementById('catalogContainer');
    const noResultsMessage = document.getElementById('noResults');

    catalogContainer.innerHTML = '';

    if (data.length === 0) {
        noResultsMessage.style.display = 'block';
    } else {
        noResultsMessage.style.display = 'none';

        data.forEach(item => {
            const inflable = `
            <div class="catalog__item">
                <div class="background" style="background: url(${item.hover}) no-repeat top center / cover"></div>            
                <a class="item__content" href="catalogo/${item.link}">
                    <div class="image" style="background: url(${item.image}) no-repeat center center / contain"></div>
                    <h2>${item.name}</h2>
                    <p class="price">Rentalo por <br> <strong>$${item.price}</strong></p>
                </a>
                <div class="info__link">
                    <a href="si" class="info__data" href="https://wa.me/525581033464?text=Hola%20me%20interesa%20tu%20producto" target="_blank">
                        <i class="fab fa-whatsapp fa-lg"></i>
                        <p>Pidelo ya!</p>
                    </a>
                </div>
            </div>
        `;
            catalogContainer.innerHTML += inflable;
        });
    }
}