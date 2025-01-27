// Obtenemos el contenedor donde se mostrarán los años
let yearContainer = document.getElementById('info-card1');
let mesContainer = document.getElementById('info-card2');
let yearMainBtn = document.getElementById('year-btn');
let mesMainBtn = document.getElementById('mes-btn');
let yearSelected;
let mesSelected;

yearMainBtn.addEventListener('click',()=>{
    cargarYears();
});

// Función para cargar los años en el contenedor
function cargarYears() {
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
                <button class="year-container" id="${year}" type="button">
                    Año: ${year}
                </button>
            `);
        });
        // Asociar eventos a los botones generados
        let yearButtons = document.querySelectorAll('.year-container');
            yearButtons.forEach(button => {
                button.addEventListener('click', () => {
                    yearSelected = button.id;
                    console.log("Año seleccionado:", yearSelected);
        });
            mesMainBtn.addEventListener('click',()=>{
                cargarMeses(yearSelected);
            });
    });
    })
    .catch((error) => console.error("Error en fetch:", error)); // Agrega manejo de errores

}
// Funcion para cargar los meses en el contenedor
function cargarMeses(years){
    fetch('/php/seleccionarArchivos.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipo: 'mes', year: years })
    })
    .then((response) => response.json()) // Llama a .json() correctamente
    .then((data) =>{
        console.log(data);
        mesContainer.innerHTML = ''; // Limpiar el contenedor
        data.forEach(mes => {
            mesContainer.insertAdjacentHTML('beforeend', `
                <button class="mes-container" id="${mes}" type="button">
                    Mes: ${mes}
                </button>
            `);
        });
        let mesButtons = document.querySelectorAll('.mes-container');
        mesButtons.forEach(button =>{
            button.addEventListener('click',()=>{
                mesSelected = button.id;
                console.log("Mes seleccionado:",mesSelected);
                generarTabla(yearSelected,mesSelected);
        });
    });
})
    .catch((error) => console.error("Error en fetch:", error)); // Agrega manejo de errores
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
                a.download = `Informe_${dato2}_${dato1}.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else if (data.error) {
                console.error("Error del servidor:", data.error);
                alert("Error: " + data.error); // Notificar al usuario
            }
        })
        .catch(error => console.error("Error en el fetch:", error));
    
}