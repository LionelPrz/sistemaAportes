// Obtenemos el contenedor donde se mostrarán los años
let yearContainer = document.getElementById('contenedorYears');
let mesContainer = document.getElementById('contenedorMes');
let containerOfYears = document.getElementById('contenedorFicheroYear');
let containerOfMes = document.getElementById('contenedorFicheroMes');
let startBtn = document.getElementById('generate-start-btn');
let endBtn = document.getElementById('generate-end-btn');
let yearSelected;
let mesSelected;

startBtn.addEventListener('click',()=>{
    cargarYears();
});

// Seccion para el manejo del aside
let botonesCategorias = document.querySelectorAll('.boton-aside');

botonesCategorias.forEach(boton=>{
    boton.addEventListener('click',(e)=>{
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");
    })
})


// Función para cargar los años en el contenedor
function cargarYears() {
    containerOfYears.classList.remove('hidden');
    startBtn.classList.add('hidden');
    // Fetch inicial para obtener los años disponibles
fetch("/php/seleccionarArchivos.php", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tipo: 'year' }),
})
    .then((response) => response.json()) // Faltaba devolver el resultado de .json()
    .then((data) => {
        console.log(data);
        yearContainer.innerHTML = ''; // Limpiar el contenedor
        data.forEach(year => {
            yearContainer.insertAdjacentHTML('beforeend', `
                <button class="boton-years" id="${year}" type="button">
                    Año: ${year}
                </button>
            `);
        });
        // Asociar eventos a los botones generados
        let yearButtons = document.querySelectorAll('.boton-years');
            yearButtons.forEach(button => {
                button.addEventListener('click', () => {
                    yearSelected = button.id;
                    console.log("Año seleccionado:", yearSelected);
                    cargarMeses(yearSelected);
        });
    });
    })
    .catch((error) => console.error("Error en fetch:", error)); // Agrega manejo de errores

}
// Funcion para cargar los meses en el contenedor
function cargarMeses(years) {
    containerOfYears.classList.add('hidden');
    containerOfMes.classList.remove('hidden');

    fetch('/php/seleccionarArchivos.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'mes', year: years })
    })
    .then(response => response.json())
    .then(data => {
        mesContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar botones

        // Convertir meses con .0 a enteros, dejando 6.5 y 12.5 intactos
        let mesesProcesados = data.map(mes => (mes === 6.5 || mes === 12.5) ? mes : Math.trunc(mes));

        mesesProcesados.forEach(mes => {
            mesContainer.insertAdjacentHTML('beforeend', `
                <button class="boton-mes" id="${mes}" type="button">
                    Mes: ${mes}
                </button>
            `);
        });

        // Asignar eventos a los botones generados
        document.querySelectorAll('.boton-mes').forEach(button => {
            button.addEventListener('click', () => {
                mesSelected = button.id;
                console.log("Mes seleccionado:", mesSelected);
                containerOfMes.classList.add('hidden');
                endBtn.classList.remove('hidden');
            });
        });

        // Corregir la asignación del evento de generación de tabla
        endBtn.addEventListener('click', () => generarTabla(yearSelected, mesSelected));
    })
    .catch(error => console.error("Error al cargar los meses:", error));
}
function generarTabla(dato1, dato2) {
    fetch('/php/generarArchivo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ mes: dato2, year: dato1 }),
    })
        .then(response => {
            if (response.headers.get('Content-Type').includes('application/json')) {
                return response.json();
            } else {
                return response.blob(); // Para archivos como Excel
            }
        })
        .then(data => {
            if (data instanceof Blob) {
                const url = window.URL.createObjectURL(data);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Declaracion Jurada Mes ${dato2} Año ${dato1}.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                alert('Archivo Descargado Correctamente');
                reinicioCarga();
            } else if (data.error) {
                console.error("Error del servidor:", data.error);
                alert("Error: " + data.error); // Notificar al usuario
            }
        })
        .catch(error => console.error("Error en el fetch:", error));
    
}
function reinicioCarga(){
    endBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
}