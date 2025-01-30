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

function enviarArchivo(file) {
    let formData = new FormData();
    formData.append('file-input', file);

    fetch('/php/importarExcel.php', {
        method: 'POST',
        body: formData,
    })
    .then(res => res.json())
    .then(data => {
        if (data.errores) {
            mostrarErroresEnGrilla(data.errores); // Solo muestra el panel de errores
        } else if (data.Error) {
            generateAlert("error", data.Error);
        } else {
            generateAlert("success", "¡Datos importados correctamente!");
            document.getElementById('error-layout').innerHTML = '';
        }
    })
    .catch(error => {
        console.error("Error en fetch:", error);
        generateAlert("error", "Error en la conexión");
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
function generateConfirmAlert(mensaje, callbackAceptar, callbackCancelar) {
    // Evitar duplicados
    if (document.getElementById("customConfirmAlert")) return;

    // Crear el alert de confirmación
    const alertHTML = `
        <div id="customConfirmAlert" class="alert-overlay">
            <div class="custom-alert custom-alert-warning">
                <div class="alert-progress-bar red1">
                    <span class="bar-content red"></span>
                </div>
                <img src="/assets/info-warning-alert.jpg" class="alert-img" alt="Advertencia">
                <p class="alert-text-warning">${mensaje}</p>
                <div class="warning-btn-container">
                    <button class="warning-btn-confirm upload-btn">Aceptar</button>
                    <button class="warning-btn-cancel upload-btn">Cancelar</button>
                </div>
            </div>
        </div>
    `;

    // Insertar en el DOM
    alertContainer.insertAdjacentHTML('afterend', alertHTML);

    // Manejar clics en los botones
    const confirmBtn = document.querySelector('.warning-btn-confirm');
    const cancelBtn = document.querySelector('.warning-btn-cancel');
    const alertElement = document.getElementById('customConfirmAlert');

    confirmBtn.addEventListener('click', () => {
        alertElement.remove();
        if (callbackAceptar) callbackAceptar();
    });

    cancelBtn.addEventListener('click', () => {
        alertElement.remove();
        if (callbackCancelar) callbackCancelar();
    });

    // Cerrar al hacer clic fuera del alert
    alertElement.addEventListener('click', (e) => {
        if (e.target === alertElement) {
            alertElement.remove();
        }
    });
}
function mostrarErroresEnGrilla(errores) {
    const main = document.querySelector('main');
    const errorList = document.createElement('div');
    const errorLayout = document.getElementById('error-layout');
    // Mostrar el panel de errores y ajustar la grilla
    main.classList.add('has-errors');
    errorLayout.classList.add('visible');
    errorLayout.innerHTML = '<h3>Errores encontrados:</h3>';
    errorList.className = 'error-list';

    // Iterar sobre cada fila con errores (ej: "12", "13", etc.)
    Object.keys(errores).forEach(fila => {
        const erroresFila = errores[fila]; // Objeto con los errores de la fila

        // Iterar sobre cada campo erróneo (ej: "mes", "cuil")
        Object.entries(erroresFila).forEach(([campo, mensaje]) => {
            const errorItem = document.createElement('div');
            errorItem.className = 'error-item';
            errorItem.innerHTML = `
                <span class="error-fila">Fila ${fila}</span>
                <span class="error-campo">${campo.toUpperCase()}:</span>
                <span class="error-mensaje">${mensaje}</span>
            `;
            errorList.appendChild(errorItem);
        });
    });

    errorLayout.appendChild(errorList);

    // Botón de reintentar
    const retryBtn = document.createElement('button');
    retryBtn.className = 'upload-btn';
    retryBtn.textContent = 'Reintentar importación';
    retryBtn.onclick = () => {
        generateConfirmAlert(
            "¿Desea reintentar? Se borrarán los errores y el archivo actual.",
            () => {
                reiniciarFormulario(); // Limpiar todo
            },
            () => console.log("Reintento cancelado.")
        );
    };
    errorLayout.appendChild(retryBtn);
}
function reiniciarFormulario() {
    const main = document.querySelector('main');
    const errorLayout = document.getElementById('error-layout');

    // Ocultar el panel de errores y resetear la grilla
    main.classList.remove('has-errors');
    errorLayout.classList.remove('visible');
    errorLayout.innerHTML = '';
    // Limpiar el input de archivo
    const importInput = document.getElementById('file-input');
    importInput.value = ''; // Elimina el archivo seleccionado
    
    // Restaurar el texto del botón de selección
    const inputLabel = document.getElementById('input-file-label');
    inputLabel.textContent = 'Seleccionar Archivo';
    
    // Eliminar el botón de subida si existe
    const uploadBtn = document.getElementById('upload-btn');
    if (uploadBtn) uploadBtn.remove();
    
    // Limpiar el panel de errores
    errorLayout.innerHTML = '';
}