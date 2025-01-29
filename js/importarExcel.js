let importInput = document.getElementById('file-input');
let uploadContainer = document.getElementById('upload-container');
let alertContainer = document.getElementById('error-layout');

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
    formData.append('file-input',file);
    fetch('/php/importarExcel.php', {
        method: 'POST',
        body: formData,
    })
        .then(res => res.json())
        .then(data => {
            if(data.Error){
                generateAlert("error", data.Error);
            }
            if(data.errores){
                generateAlert("error",JSON.stringify(data.errores));
            }
            else{
                generateAlert("success",data.mensaje || "Datos importados con exito");
            }
        })
        .catch(error => {
            console.error("Error en fetch:", error); // Ver el error en consola
            generateAlert("error", "Error en la petición");
        });
}
function generateAlert(resultado, mensaje = null){

    // Validacion precencia para evitar duplicados
    if(document.getElementById("customAlert")) return;

    // declaracion de variables
    let texto;
    let imagen;
    let claseCont = "custom-alert";
    let claseText = "alert-text";
    let clasePbar = "alert-progress-bar"
    let claseBar = "bar-content";

    // Comprobacion de resultado

    switch(resultado){

        case "error":
            // Generacion del alert de error
            imagen ="/assets/ayuyu-angry-png.png";
            texto = mensaje || "Se produjo un error al enviar el formulario !";
            claseText = "alert-text-error";
            clasePbar = "alert-progress-bar  red1";
            claseBar = "bar-content red";
            claseCont += " custom-alert-error";
            break;
        
        case "success":
            // Generacion del alert de exito
            imagen ="/assets/typo yukari A2.png";
            texto = mensaje || "Formulario enviado Correctamente";
            claseCont += " custom-alert-success";
            clasePbar = "alert-progress-bar green1"
            claseBar = "bar-content green";
            break;
        
        case "info":
            // Generacion del alert de informacion
            imagen ="/assets/info-warning-alert.jpg";
            claseText = "alert-text-info";
            texto = mensaje || "Por favor permita el acceso a su ubicacion !";
            claseCont += " custom-alert-info";
            clasePbar = "alert-progress-bar blue1"
            claseBar = "bar-content blue";
            break;
    }

            // Generar el elemento de manera dinamica y insertarlo despues del boton
            alertContainer.insertAdjacentHTML('afterend',`
                <div id="customAlert" class="alert-overlay">
                    <div class="${claseCont}">
                    <div class="${clasePbar}">
                    <span class="${claseBar}"></span>
                </div>
                    <img src="${imagen}" class="alert-img" alt="imagen mamalona">
                    <p class="${claseText}">${texto}</p>
                </div>
            </div>
            `);

        const idCont = document.getElementById("customAlert");

                idCont.addEventListener('click',(e)=>{
                e.stopPropagation();
            });
            setTimeout(()=>{
                idCont.remove()
            },5000);
    }