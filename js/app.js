// Variables para el night mode
let darkMode = document.querySelector('.app');
let interruptor = document.getElementById('dark');

interruptor.addEventListener('click',()=>{
    modoOscuro();
});

function modoOscuro(){
    darkMode.classList.toggle('dark');
}
