let years = [];
let meses = [];
let contenido;
let contenedorMes = document.getElementById('info-card2');
let contenedorYear = document.getElementById('info-card1');

    fetch("/js/prueba.json")
    .then(response => response.json())
    .then(data => {
        contenido = data;
        generarYear(contenido);
        generarMes(contenido);
});

function generarMes(mesesEncontrados){
    mesesEncontrados.forEach(elemento => {
        meses.push(elemento.mes);
    });
    meses.forEach(item =>{
        console.log(item);
        contenedorMes.insertAdjacentHTML('afterbegin',`
            <div class="mes-container">
                <p class="mes-text">${item}</p>
            </div>
            `);
    });
}

function generarYear(yearsEncontrados){
    yearsEncontrados.forEach(elemento =>{
        years.push(elemento.year);
    });
    years.forEach(item =>{
        contenedorYear.insertAdjacentHTML('afterbegin',`
            <div class="year-container">
                <p class="year-text">${item}</p>
            </div>
            `);
    });
}