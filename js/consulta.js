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



formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    valorCuil = document.getElementById('cuil').value;
    fetch("/php/consulta.php",{
        method: "POST",
        body: JSON.stringify({cuil:valorCuil}),
        headers:{
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if(!response.ok){
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        contenido = data;
        cargarDatos(contenido);
        encontrarCuil(valorCuil);
    })
    .catch(error =>{
        console.error('Hubo un error en la consulta:', error);
    })
});

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
    console.log(datosCargados);
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
    // Realizar el fetch para obtener los datos desde el backend
    fetch('/php/datosEmpleados.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            cuil: cuilFiltrado,
            mes: mesFiltrado,
            year: yearFiltrado
        })
    })
    .then(response => response.json())  // Convertir la respuesta en formato JSON
    .then(data => {
        if (data.error) {
            // Si hay un error, mostrar el mensaje
            console.error(data.error);
            return;
        }

        // Si los datos están disponibles, mostrarlos en el contenedor
        contenedorYear.insertAdjacentHTML('beforeend', `
            <h3 class="empleado-text">Datos del Empleado</h3>
            <ul class="ul-empleado">
                <li class="li-empleado"><p class="ul-text">Nombre: ${data.nombre}</p></li>
                <li class="li-empleado"><p class="ul-text">Apellido: ${data.apellido}</p></li>
                <li class="li-empleado"><p class="ul-text">Cargo: ${data.cargo}</p></li>
                <li class="li-empleado"><p class="ul-text">Clase: ${data.clase}</p></li>
                <li class="li-empleado"><p class="ul-text">Categoria: ${data.categoria}</p></li>
                <li class="li-empleado"><p class="ul-text">Tipo contratación: ${data.tipo_contratacion}</p></li>
                <li class="li-empleado"><p class="ul-text">Tipo liquidación: ${data.tipo_liquidacion}</p></li>
                <li class="li-empleado"><p class="ul-text">Dias trabajados: ${data.dias_trabajados}</p></li>
            </ul>
        `);

        contenedorMes.insertAdjacentHTML('beforeend', `
            <h3 class="previsional-text">Datos Previsionales</h3>
            <ul class="ul-previsional">
                <li class="li-previsional"><p class="ul-text">Total Remunerativo: $${data.total_remunerativo}</p></li>
                <li class="li-previsional"><p class="ul-text">Total no remunerativo: $${data.total_no_remunerativo}</p></li>
                <li class="li-previsional"><p class="ul-text">Aporte adicional: ${data.aporte_adicional}</p></li>
                <li class="li-previsional"><p class="ul-text">Monto aporte adicional: ${data.monto_aporte_adicional}</p></li>
                <li class="li-previsional"><p class="ul-text">Tipo de licencia: ${data.tipo_licencia}</p></li>
                <li class="li-previsional"><p class="ul-text">Dias de licencia: ${data.dias_licencia}</p></li>
                <li class="li-previsional"><p class="ul-text">Mes: ${data.mes}</p></li>
                <li class="li-previsional"><p class="ul-text">Año: ${data.año}</p></li>
            </ul>
        `);

        // Cambio de función del botón de consulta
        botonGenerar.style.display = "none";
        botonReseteo.style.display = "block";
        botonConsultar.disabled = true;
        botonReseteo.addEventListener('click', reiniciarEstado);
    })
    .catch(error => {
        console.error("Error al obtener los datos: ", error);
    });
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