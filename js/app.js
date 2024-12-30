// Variables para el night mode
let darkMode = document.querySelector('.app');
let cards = document.querySelectorAll('.card');
let interruptor = document.getElementById('dark');

// Variables para la redireccion
let barraCarga = document.getElementById('loader-bar');
let botones = document.querySelectorAll('.boton');
let contenedor = document.getElementById('container');
const rutasBotones = [
    {id:'insert-btn', route:'../html/ingresar.html'},
    {id:'consult-btn', route:'../html/consultar.html'},
    {id:'generate-btn', route:'../html/generar.html'},
    // {id:'insert-btn', route:'../html/insertar.html'},
];

botones.forEach(boton =>{
    boton.addEventListener('click',event =>{
        let idbtn = event.currentTarget;
            encontrarRuta(idbtn.id);
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

// Funcion para dar con las rutas
function encontrarRuta(id){
    let rutas = rutasBotones.find(item=> item.id === id);
        if(rutas){
            cargarContenido(rutas.route);
    }else{
        console.error('Ruta no encontrada para el boton'+  rutas);
    }
}
// Funcion para cargar el contenido
async function cargarContenido(rutas){
    if(!contenedor){
        console.error(`No se encontro el contenedor en ${rutas}`);
        return;
    }
    // Inicio de barra de carga
    contenedor.innerHTML= '';
    barraCarga.style.display='block';
    try{
        let respuesta = await fetch(rutas);
        if(!respuesta.ok){
            console.error(`Error al cargar la siguente ruta: ${rutas} `);
        }

        let iframe = document.createElement('iframe');
            iframe.src = rutas;
            contenedor.appendChild(iframe);
            console.log('Contenido cargado exitosamente');
            barraCarga.style.display='none';
    }catch(error){
        console.error('Error al cargar el contenido: ',error);
        contenedor.innerHTML = '<p>Error al cargar el contenido</p>';
    }
}