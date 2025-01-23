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
fetch("/php/generarArchivos.php", {
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
    fetch('/php/generarArchivos.php', {
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
function generarTabla(dato1,dato2){
    console.log(dato1,dato2);
}