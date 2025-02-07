// Variables globales
let datos = [];
let valorCuil;
let yearSelect;
let mesSelect;
let contenido;
let yearDisponibles;
let mesesDisponibles;
let cuilEncontrado;

// Elementos del DOM
let contenedorMes = document.getElementById('contenido-mes');
let contenedorYear = document.getElementById('contenido-years');
let contenedorDatosConsultados = document.getElementById('consultDatos');
let formulario = document.querySelector('.form-consult');
let botonConsulta = document.getElementById('consultBtn');
let contenedorAceptarBtn = document.getElementById('ContainerAct');
let barraCarga = document.getElementById('loader-bar');
let contenedorFichas = document.getElementById('contenedorFichas');
let fichaMes = document.getElementById('ficha-mes');
let fichaYear = document.getElementById('ficha-year');
let fichaConsultar = document.getElementById('ficha-consultar');
let fichaResultado = document.getElementById('ficha-resultado');
let textcontainer = document.getElementById('text-container');

// Fichas ordenadas en el flujo correcto
let fichas = { fichaYear, fichaMes, fichaConsultar, fichaResultado };

// Manejo de aside
let botonesCategorias = document.querySelectorAll('.boton-aside');
botonesCategorias.forEach(boton => {
    boton.addEventListener('click', (e) => {
        botonesCategorias.forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
    });
});

// Envío del formulario
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    valorCuil = document.getElementById('cuil').value;
    fetch("/php/consultarDatos.php", {
        method: "POST",
        body: JSON.stringify({ cuil: valorCuil }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        contenido = data;
        cargarDatos(contenido);
        encontrarCuil(valorCuil);
        moverFichaAlFrente(fichas.fichaYear);
        formulario.classList.add('hidden');
        contenedorFichas.classList.remove('hidden');
    })
    .catch(error => {
        alert('Hubo un error en la consulta: ' + error)
        location.reload();
    });
});

// Manejo de clic en solapas
let solapas = document.querySelectorAll('.solapa');
solapas.forEach(solapa => {
    solapa.addEventListener('click', (e) => {
        let fichaSeleccionada = e.target.parentElement;
        moverFichaAlFrente(fichaSeleccionada);
    });
});

// Mover ficha al frente con desplazamiento suave
function moverFichaAlFrente(ficha) {
    let fichero = Object.values(fichas).find(item => item.classList.contains('activa'));
    
    if (fichero) {
        fichero.classList.remove('activa');
    }
    
    ficha.classList.add('activa');
}
// Cargar los datos obtenidos
function cargarDatos(datosCargados) {
    datos = [...datosCargados];
}

// Buscar CUIL en los datos
function encontrarCuil(datosComparados) {
    cuilEncontrado = datos.filter(item => item.cuil === datosComparados);
    if (cuilEncontrado.length > 0) {
        encontrarYear(cuilEncontrado);
    } else {
        alert('No hay coincidencias para el CUIL: ' + datosComparados);
        location.reload();
    }
}

// Buscar años disponibles
function encontrarYear(cuil) {
    yearDisponibles = [...new Set(cuil.map(item => item.year))];
    contenedorYear.innerHTML = '';
    yearDisponibles.forEach(year => {
        contenedorYear.insertAdjacentHTML('beforeend',`
            <button class="boton-years" id="${year}">Año: ${year}</button>
            `);
        });
    document.querySelectorAll('.boton-years').forEach(button => {
        button.addEventListener('click', (e) => {
            yearSelect = e.currentTarget.id;
            encontrarMeses(cuilEncontrado, yearSelect);
            moverFichaAlFrente(fichas.fichaMes);
        });
    });
}

// Buscar meses disponibles
function encontrarMeses(datosEncontrados, yearSeleccionado) {
    yearSeleccionado = parseInt(yearSeleccionado, 10);
    mesesDisponibles = [...new Set(datosEncontrados.filter(item => item.year === yearSeleccionado).map(item => item.mes))];
    contenedorMes.innerHTML = '';
    mesesDisponibles.forEach(mes => {
        contenedorMes.insertAdjacentHTML('beforeend', 
            `<button class="boton-mes" id="${mes}">Mes: ${mes}</button>`);
    });
    
    document.querySelectorAll('.boton-mes').forEach(boton => {
        boton.addEventListener('click', (e) => {
            mesSelect = e.currentTarget.id;
            moverFichaAlFrente(fichas.fichaConsultar);
        });
    });
}

// Generar consulta
botonConsulta.addEventListener('click', (event) => {
    event.preventDefault();
    barraCarga.style.display = 'block';
    generarConsulta(valorCuil, mesSelect, yearSelect);
});

// Fetch para obtener datos
function generarConsulta(cuilFiltrado, mesFiltrado, yearFiltrado) {
    fetch('/php/datosEmpleados.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ cuil: cuilFiltrado, mes: mesFiltrado, year: yearFiltrado })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
            return;
        }
        mostrarResultados(data);
    })
    .catch(error =>{
        alert("Error al obtener los datos: " + error)
        location.reload();
    });     
}

// Mostrar resultados en la última ficha
function mostrarResultados(data) {
    textcontainer.innerHTML = '';
    textcontainer.insertAdjacentHTML('beforeend',`
      <ul id="ulEmpleado" class="ul-empleado">
            <li class="li-empleado"><p class="ul-text">Nombre: ${data.nombre}</p></li>
                <li class="li-empleado"><p class="ul-text">Apellido: ${data.apellido}</p></li>
                <li class="li-empleado"><p class="ul-text">Cargo: ${data.cargo_funcion}</p></li>
                <li class="li-empleado"><p class="ul-text">Clase: ${data.cargo_clase}</p></li>
                <li class="li-empleado"><p class="ul-text">Categoria: ${data.cargo_categoria}</p></li>
                <li class="li-empleado"><p class="ul-text">Tipo contratación: ${data.tipo_contratacion}</p></li>
                <li class="li-empleado"><p class="ul-text">Tipo liquidación: ${data.tipo_liquidacion}</p></li>
                <li class="li-empleado"><p class="ul-text">Dias trabajados: ${data.dias_trabajados}</p></li>
            </ul>
            <ul id="ulPrevisional" class="ul-previsional">
                <li class="li-previsional"><p class="ul-text">Total Remunerativo: $ ${data.total_remunerativo}</p></li>
                <li class="li-previsional"><p class="ul-text">Total no remunerativo: $ ${data.total_no_remunerativo}</p></li>
                <li class="li-previsional"><p class="ul-text">Aporte adicional: ${data.tipo_aporte_adicional}</p></li>
                <li class="li-previsional"><p class="ul-text">Monto aporte adicional: ${data.monto_aporte_adicional}</p></li>
                <li class="li-previsional"><p class="ul-text">Tipo de licencia: ${data.tipo_licencia}</p></li>
                <li class="li-previsional"><p class="ul-text">Dias de licencia: ${data.dias_licencia}</p></li>
                <li class="li-previsional"><p class="ul-text">Mes: ${data.sueldo_mes}</p></li>
                <li class="li-previsional"><p class="ul-text">Año: ${data.sueldo_year}</p></li>
            </ul>
        `);
        contenedorDatosConsultados.insertAdjacentHTML('beforeend',`
                <button class="accept-btn hidden" id="aceptarBtn">
                    <span class="icon">Aceptar</span>
                </button>
            `);
        let botonAceptar = document.getElementById('aceptarBtn');
        botonAceptar.classList.remove('hidden');
        moverFichaAlFrente(fichas.fichaResultado);
        
        // Reiniciar consulta
        botonAceptar.addEventListener('click', () => {
            location.reload();
        });
}
