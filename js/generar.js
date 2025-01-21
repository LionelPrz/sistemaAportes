// Obtenemos el contenedor donde se mostrarán los años
let yearContainer = document.getElementById('info-card1');

// Fetch inicial para obtener los años disponibles
fetch("/php/generarArchivos.php")
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener los años");
        }
        return response.json();
    })
    .then(years => {
        // Llenamos el contenedor con los años obtenidos
        cargarYears(years);
    })
    .catch(error => console.error("Error en el fetch:", error));

// Función para cargar los años en el contenedor
function cargarYears(years) {
    yearContainer.innerHTML = ''; // Limpiar el contenedor
    years.forEach(year => {
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
            let yearSelected = button.id;
            console.log("Año seleccionado:", yearSelected);
            // Aquí llamarás al siguiente fetch para obtener los meses
        });
    });
}