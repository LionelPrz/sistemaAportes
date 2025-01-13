let botonYear = document.getElementById('year-btn');
let botonMes = document.getElementById('mes-btn');
let yearContainer = document.getElementById('info-card1');
let mesContainer = document.getElementById('info-card2');
let formulario = document.getElementById('form-generate');
let datos = [];
let yearSelected;
let mesSelected;
let yearDisponibles;
let mesDiponibles;

fetch("/js/prueba.json")
    .then(response => response.json())
    .then(data => {
        let contenido = data;
        cargarDatos(contenido);
    });

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
});

function cargarDatos(datosObtenidos) {
    datos.push(datosObtenidos);
    encontrarYear(datosObtenidos);
}

function encontrarYear(datosRecepcionados) {
    yearDisponibles = [...new Set(datosRecepcionados.map(item => item.year))];
    console.log(yearDisponibles);
    if (yearDisponibles.length > 0) {
        yearContainer.innerHTML = '';
        yearDisponibles.forEach(year => {
            yearContainer.insertAdjacentHTML('beforeend', `
                        <button class="year-container" id="${year}" type="button">
                        Año: ${year}
                    </button>
                `);
        });
        // Recuperar los botones recien creados por el filtro
        let contenidoBotones = document.querySelectorAll('#info-card1 button');
        // Recorremos el elemento contenedor y asignamos los eventos
        contenidoBotones.forEach(botones => {
            botones.addEventListener('click', (e) => {
                yearSelected = e.currentTarget.id;
                encontrarMes(datosRecepcionados, yearSelected);
            });
        });
    }
}
function encontrarMes(datosFiltrados, datoSeleccionado) {
    mesDiponibles = [...new Set(datosFiltrados.filter(item => item.year === datoSeleccionado).map(item => item.mes))];
    console.log(mesDiponibles);
    mesContainer.innerHTML = '';
    // Generacion de los meses en botones
    mesDiponibles.forEach(mes => {
        mesContainer.insertAdjacentHTML('beforeend', `
            <button class="mes-container" id="${mes}" type="button">
                Mes: ${mes}
            </button>
        `);
    });
    let contenidoBotones = document.querySelectorAll('#info-card2 button');
    contenidoBotones.forEach(boton => {
        boton.addEventListener('click', (e) => {
            mesSelected = e.currentTarget.id;
        });
    });
}



