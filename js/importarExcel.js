let importInput = document.getElementById('file-input');
let uploadContainer = document.getElementById('upload-container');

importInput.addEventListener('change',function(event){
    let fileName = event.currentTarget;
    let buttonText = document.querySelector('.input-file-label');

    if(fileName.files.length > 0 && !document.getElementById('upload-btn')){
        buttonText.textContent = fileName.files[0].name;
        uploadContainer.insertAdjacentHTML('beforeend',`
            <button id="upload-btn" class="upload-btn" type="button">Subir Archivo</button>
        `);
    }
    let uploadBtn = document.getElementById('upload-btn');
    uploadBtn.addEventListener('click',()=>{
        enviarArchivo(fileName.files[0]);
    });
});

function enviarArchivo(file){
    let formData = new FormData();
    formData.append('file',file);
    
    fetch('/php/importarExcel.php',{
        method: 'POST',
        body: formData,
    })
        .then(res=>res.json())
        .then(data=>{
            if(data.errores){
                Object.keys(data.errores).forEach(fila=>{
                    console.log(`Errores en la fila ${fila}`);
                    Object.keys(data.errores[fila]).forEach(campo=>{
                        console.log(`${campo}: ${data.errores[fila][campo]}`)
                    });
                });
            }else{
                console.log(data.mensaje);
            }
        })
        .catch(error=>{
            console.error('Error:',error);
        })
}