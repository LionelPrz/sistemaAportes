// Variables para el night mode
let darkMode = document.querySelector('.app');
let cards = document.querySelectorAll('.card');
let interruptor = document.getElementById('dark');
// Variables para la redireccion
let botones = document.querySelectorAll('button');
const rutasBotones = [
    {id:'insert-btn', route:'../html/insertar.html'},
    {id:'consult-btn', route:'../html/consultar.html'},
    {id:'generate-btn', route:'../html/generar.html'},
    // {id:'insert-btn', route:'../html/insertar.html'},
];

botones.forEach(boton=>{
    boton.addEventListener('click',(e)=>{
    let idbtn = e.target.id;
        console.log(idbtn);
        encontrarRuta(idbtn);
    });
});

interruptor.addEventListener('click',()=>{
    modoOscuro();
});
// Funcion para el modo oscuro
function modoOscuro(){
    darkMode.classList.toggle('dark');
    cards.forEach(card => {
        card.classList.toggle('dark-card');
    });
}
// Funcion para cargar el contenido
// Funcion para dar con las rutas
function encontrarRuta(id){
    let rutas = rutasBotones.find(item=> item.id === id);

    if(rutas){
        console.log(rutas.route);
    }else{
        console.error('Ruta no encontrada para el boton'+ rutas);
    }
}