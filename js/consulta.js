let datos = [];
let contenido;
let contenedorMes = document.getElementById('info-card2');
let contenedorYear = document.getElementById('info-card1');
let formulario = document.querySelector('.form-consult');
let botonGenerar = document.getElementById('generate-consult-btn');
let botonConsultar = document.getElementById('consult-btn');
let botonReseteo = document.getElementById('reset-consult-btn');
let barraCarga = document.getElementById('loader-bar');
let yearSelect;
let mesSelect;
let yearDisponibles;
let cuilEncontrado;
let mesesDiponibles;
let valorCuil;

fetch("/js/prueba.json")
.then(response => response.json())
.then(data => {
    contenido = data;
    cargarDatos(contenido);
});

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    valorCuil = document.getElementById('cuil').value;
    encontrarCuil(valorCuil);
})

botonGenerar.addEventListener('click', event => {
    event.preventDefault();
    console.log(valorCuil, mesSelect, yearSelect);
    barraCarga.style.display = 'block';
    contenedorMes.innerHTML = '';
    contenedorYear.innerHTML = '';
    generarConsulta(valorCuil, mesSelect, yearSelect);
    console.log('datos cargados correctamente');
    barraCarga.style.display = 'none'
});

function cargarDatos(datosCargados) {
    datosCargados.forEach(elemento => {
        datos.push(elemento);
    });
}

function encontrarCuil(datosComparados) {

    cuilEncontrado = datos.filter(item => item.cuil === datosComparados);
    if (cuilEncontrado.length > 0) {
        encontrarYear(cuilEncontrado);
    }
    else {
        console.error('no hay coincidencias para el cuil numero: ' + cuilEncontrado);

    }

    function encontrarYear(cuil) {
        yearDisponibles = [...new Set(cuil.map(item => item.year))];
        contenedorYear.innerHTML = '';
        // Generacion de los items tipo botones
        yearDisponibles.forEach(year => {
            contenedorYear.insertAdjacentHTML('beforeend', `
                <button class="year-container" id="${year}" type="button">
                    Año: ${year}
                </button>
            `);
        });
        // Recuperamos los botones recien creados por el filtro
        let contenidoBotones = document.querySelectorAll('#info-card1 button');
        // Ahora lo recorremos con foreach y le damos eventos click
        contenidoBotones.forEach(botones => {
            botones.addEventListener('click', (e) => {
                yearSelect = e.currentTarget.id;
                encontrarMeses(cuilEncontrado, yearSelect);
            });
        });
    }

    function encontrarMeses(datosEncontrados, yearSeleccionado) {
        mesesDiponibles = [...new Set(datosEncontrados.filter(item => item.year === yearSeleccionado).map(item => item.mes))];
        contenedorMes.innerHTML = '';
        // Generacion de los items tipo botones
        mesesDiponibles.forEach(mes => {
            contenedorMes.insertAdjacentHTML('beforeend', `
                <button class="mes-container" id="${mes}" type="button">
                    Mes: ${mes}
                </button>
            `);
        });
        let botonesMes = document.querySelectorAll('#info-card2 button');
        botonesMes.forEach(boton => {
            boton.addEventListener('click', (e) => {
                mesSelect = e.currentTarget.id;
                botonGenerar.disabled = false;
            });
        });
    }
}

function generarConsulta(cuilFiltrado, mesFiltrado, yearFiltrado) {
    let datoConsulta = cuilEncontrado.find(item => item.cuil === cuilFiltrado && item.mes === mesFiltrado && item.year === yearFiltrado);
    console.log(datoConsulta);
    contenedorYear.insertAdjacentHTML('beforeend', `
            <h3 class="empleado-text">Datos del Empleado</h3>
                <ul class="ul-empleado">
                    <li class="li-empleado"><p class="ul-text">Nombre: ${datoConsulta.nombre}</p></li>
                    <li class="li-empleado"><p class="ul-text">Apellido: ${datoConsulta.apellido}</p></li>
                    <li class="li-empleado"><p class="ul-text">Cargo: ${datoConsulta.cargo}</p></li>
                    <li class="li-empleado"><p class="ul-text">Clase: ${datoConsulta.clase}</p></li>
                    <li class="li-empleado"><p class="ul-text">Categoria: ${datoConsulta.categoria}</p></li>
                    <li class="li-empleado"><p class="ul-text">Tipo contratación: ${datoConsulta.tipoContratacion}</p></li>
                    <li class="li-empleado"><p class="ul-text">Tipo liquidación: ${datoConsulta.tipoLiquidacion}</p></li>
                    <li class="li-empleado"><p class="ul-text">Dias trabajados: ${datoConsulta.diasTrabajados}</p></li>
                </ul>
        `);
    contenedorMes.insertAdjacentHTML('beforeend', `
            <h3 class="previsional-text">Datos Previsionales</h3>
                <ul class="ul-previsional">
                    <li class="li-previsional"><p class="ul-text">Total Remunerativo: $${datoConsulta.totalRemunerativo}</p></li>
                    <li class="li-previsional"><p class="ul-text">Total no remunerativo: $${datoConsulta.totalNoRemunerativo}</p></li>
                    <li class="li-previsional"><p class="ul-text">Aporte adicional: ${datoConsulta.aporteAdicional}</p></li>
                    <li class="li-previsional"><p class="ul-text">Monto aporte adicional: ${datoConsulta.montoAporteAdicional}</p></li>
                    <li class="li-previsional"><p class="ul-text">Tipo de licencia: ${datoConsulta.tipoLicencia}</p></li>
                    <li class="li-previsional"><p class="ul-text">Dias de licencia: ${datoConsulta.diasLicencia}</p></li>
                    <li class="li-previsional"><p class="ul-text">Mes: ${datoConsulta.mes}</p></li>
                    <li class="li-previsional"><p class="ul-text">Año: ${datoConsulta.year}</p></li>
                </ul>
        `);
    // Cambio de funcion del boton de consulta
    botonGenerar.style.display = "none";
    botonReseteo.style.display = "block";
    botonConsultar.disabled = true;
    botonReseteo.addEventListener('click', reiniciarEstado);
}

function reiniciarEstado() {
    contenedorMes.innerHTML = '';
    contenedorYear.innerHTML = '';
    formulario.reset();
    botonGenerar.style.display = "block";
    botonGenerar.disabled = true;
    botonReseteo.style.display = "none";
    botonConsultar.disabled = false;
}