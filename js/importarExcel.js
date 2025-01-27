let importInput = document.getElementById('import-input');

importInput.addEventListener('change',function(event){
    let fileName = event.currentTarget;
    let buttonText = document.querySelector('.import-text');

    if(fileName.files.length > 0 ){
        buttonText.textContent = fileName.files[0].name;
    }
});

// function cargarArchivo(evento){
    
// }