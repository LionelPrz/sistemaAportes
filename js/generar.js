// Elementos del DOM
let yearContainer = document.getElementById('contenedorYears');
let fichasContainer = document.getElementById('contenedorFichas');
let mesContainer = document.getElementById('contenedorMes');
let containerOfYears = document.getElementById('ficha-year');
let containerOfMes = document.getElementById('ficha-mes');
let finalContainer = document.getElementById('ficha-final');
let startBtn = document.getElementById('generate-start-btn');
let endBtn = document.getElementById('generate-end-btn');
let yearSelected;
let mesSelected;
let fichas = [containerOfYears, containerOfMes, finalContainer]; // Todas las fichas

startBtn.addEventListener('click', () => {
    fichasContainer.classList.remove('hidden');
    moverFichaAlFrente(containerOfYears);
    cargarYears();
    startBtn.classList.add('hidden');
});

// Manejo de clic en solapas
let solapas = document.querySelectorAll('.solapa');
solapas.forEach(solapa => {
    solapa.addEventListener('click', (e) => {
        let fichaSeleccionada = e.target.parentElement;
        moverFichaAlFrente(fichaSeleccionada);
    });
});

// Función para mover una ficha al frente
function moverFichaAlFrente(ficha) {
    fichas.forEach(f => f.classList.remove('activa'));
    ficha.classList.add('activa');
    
    if (ficha !== containerOfYears) { // Mantener YEAR en el fondo
        fichas = fichas.filter(f => f !== ficha);
        fichas.unshift(ficha);
    }
    
    fichas.forEach((f, i) => f.style.zIndex = i);
}

// Función para cargar los años
function cargarYears() {
    yearContainer.innerHTML = '';
    fetch("/php/seleccionarArchivos.php", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'year' }),
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(year => {
            yearContainer.insertAdjacentHTML('beforeend', `
                <button class="boton-years" id="${year}" type="button">
                    Año: ${year}
                </button>
            `);
        });
        document.querySelectorAll('.boton-years').forEach(button => {
            button.addEventListener('click', () => {
                yearSelected = button.id;
                console.log("Año seleccionado:", yearSelected);
                moverFichaAlFrente(containerOfMes);
                cargarMeses(yearSelected);
            });
        });
    });
}

// Función para cargar los meses
function cargarMeses(years) {
    mesContainer.innerHTML = '';
    fetch('/php/seleccionarArchivos.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'mes', year: years })
    })
    .then(response => response.json())
    .then(data => {
        let mesesProcesados = data.map(mes => (mes === 6.5 || mes === 12.5) ? mes : Math.trunc(mes));
        mesesProcesados.forEach(mes => {
            mesContainer.insertAdjacentHTML('beforeend', `
                <button class="boton-mes" id="${mes}" type="button">
                    Mes: ${mes}
                </button>
            `);
        });
        document.querySelectorAll('.boton-mes').forEach(button => {
            button.addEventListener('click', () => {
                mesSelected = button.id;
                console.log("Mes seleccionado:", mesSelected);
                moverFichaAlFrente(finalContainer);
                endBtn.classList.remove('hidden');
            });
        });
        endBtn.addEventListener('click', () => generarTabla(yearSelected, mesSelected));
    });
}

// Función para generar el archivo
function generarTabla(dato1, dato2) {
    fetch('/php/generarArchivo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ mes: dato2, year: dato1 }),
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Declaracion_Jurada_Mes_${dato2}_Año_${dato1}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        alert('Archivo Descargado Correctamente');
        reinicioCarga();
    })
    .catch(error => 
        alert(error),
        console.error("Error en el fetch:", error));
}

// Reiniciar la interfaz
function reinicioCarga() {
    endBtn.classList.add('hidden');
    fichasContainer.classList.add('hidden');
    startBtn.classList.remove('hidden');
    moverFichaAlFrente(containerOfYears);
}
