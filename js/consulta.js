let datos = [];
let contenido;
let contenedorMes = document.getElementById('info-card2');
let contenedorYear = document.getElementById('info-card1');
let contenedorDatosConsultados = document.getElementById('consultDatos');
let formulario = document.querySelector('.form-consult');
let botonConsulta = document.getElementById('consultBtn');
let botonAceptar = document.getElementById('aceptarBtn');
let contenedorConsultaBtn = document.getElementById('ContainerBtn');
let contenedorAceptarBtn = document.getElementById('ContainerAct');
let barraCarga = document.getElementById('loader-bar');
let seccionConsulta = document.getElementById('section1');
let seccionSeleccion = document.getElementById('section2');
let seccionDatos = document.getElementById('section3');
let yearSelect;
let mesSelect;
let yearDisponibles;
let cuilEncontrado;
let mesesDiponibles;
let valorCuil;
let ulPrevisional;
let ulEmpleados;

// Seccion para el manejo del aside
let botonesCategorias = document.querySelectorAll('.boton-aside');

botonesCategorias.forEach(boton=>{
    boton.addEventListener('click',(e)=>{
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");
    })
})


formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    valorCuil = document.getElementById('cuil').value;
    fetch("/php/consultarDatos.php",{
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
        seccionConsulta.classList.add('hidden');
        seccionSeleccion.classList.remove('hidden');
    })
    .catch(error =>{
        console.error('Hubo un error en la consulta:', error);
    })
});

botonConsulta.addEventListener('click', event => {
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
        console.log(yearDisponibles);
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
                console.log(yearSelect);
                console.log(cuilEncontrado);
                encontrarMeses(cuilEncontrado, yearSelect);
            });
        });
    }

    function encontrarMeses(datosEncontrados, yearSeleccionado) {
        yearSeleccionado = parseInt(yearSeleccionado,10);
        mesesDiponibles = [...new Set(datosEncontrados.filter(item => item.year === yearSeleccionado).map(item => item.mes))];
        console.log(mesesDiponibles);
        contenedorMes.innerHTML = '';
        // Generacion de los items tipo botones
        mesesDiponibles.forEach(mes => {
            contenedorMes.insertAdjacentHTML('beforeend', `
                <button class="year-container" id="${mes}" type="button">
                    Mes: ${mes}
                </button>
            `);
        });
        let botonesMes = document.querySelectorAll('#info-card2 button');
        botonesMes.forEach(boton => {
            boton.addEventListener('click', (e) => {
                mesSelect = e.currentTarget.id;
                contenedorConsultaBtn.classList.remove('hidden');
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
        console.log(data);
        if (data.error) {
            // Si hay un error, mostrar el mensaje
            console.error(data.error);
            return;
        }
        seccionSeleccion.classList.add('hidden');
        seccionDatos.classList.remove('hidden');
        contenedorDatosConsultados.classList.remove('hidden');
        // Si los datos están disponibles, mostrarlos en el contenedor
        contenedorDatosConsultados.insertAdjacentHTML('beforeend', `
            <h3 class="empleado-text">Datos del Empleado</h3>
            <ul id="ulEmpleado" class="ul-empleado">
                <li class="li-empleado"><p class="ul-text">Nombre: ${data.Nombre}</p></li>
                <li class="li-empleado"><p class="ul-text">Apellido: ${data.Apellido}</p></li>
                <li class="li-empleado"><p class="ul-text">Cargo: ${data.funcion}</p></li>
                <li class="li-empleado"><p class="ul-text">Clase: ${data.clase}</p></li>
                <li class="li-empleado"><p class="ul-text">Categoria: ${data.categoria}</p></li>
                <li class="li-empleado"><p class="ul-text">Tipo contratación: ${data.Tipo_contratacion}</p></li>
                <li class="li-empleado"><p class="ul-text">Tipo liquidación: ${data.Tipo_liquidacion}</p></li>
                <li class="li-empleado"><p class="ul-text">Dias trabajados: ${data.dias_trabajados}</p></li>
            </ul>
        `);

        contenedorDatosConsultados.insertAdjacentHTML('beforeend', `
            <ul id="ulPrevisional" class="ul-previsional">
                <li class="li-previsional"><p class="ul-text">Total Remunerativo: $${data.Total_remunerativo}</p></li>
                <li class="li-previsional"><p class="ul-text">Total no remunerativo: $${data.Total_no_remunerativo}</p></li>
                <li class="li-previsional"><p class="ul-text">Aporte adicional: ${data.Tipo_aporte_adicional}</p></li>
                <li class="li-previsional"><p class="ul-text">Monto aporte adicional: ${data.Monto_aporte_adicional}</p></li>
                <li class="li-previsional"><p class="ul-text">Tipo de licencia: ${data.tipo_licencia}</p></li>
                <li class="li-previsional"><p class="ul-text">Dias de licencia: ${data.dias_licencia}</p></li>
                <li class="li-previsional"><p class="ul-text">Mes: ${data.Mes}</p></li>
                <li class="li-previsional"><p class="ul-text">Año: ${data.Year}</p></li>
            </ul>
        `);
        // Cambio de función del botón de consulta
        ulEmpleados = document.getElementById('ulEmpleados');
        ulPrevisional = document.getElementById('ulPrevisional');
        contenedorAceptarBtn.classList.remove('hidden');
        botonAceptar.addEventListener('click', reiniciarEstado);
    })
    .catch(error => {
        console.error("Error al obtener los datos: ", error);
    });
}

function reiniciarEstado() {
    contenedorMes.innerHTML = '';
    contenedorYear.innerHTML = '';
    formulario.reset();
    seccionDatos.classList.add('hidden');
    botonConsulta.classList.add('hidden');
    contenedorDatosConsultados.classList.add('hidden');
    seccionConsulta.classList.remove('hidden');
}