let importInput = document.getElementById('file-input');
let uploadContainer = document.getElementById('upload-container');
let alertContainer = document.getElementById('error-layout');

importInput.addEventListener('change', function (event) {
    let file = event.target.files[0];
    let buttonText = document.querySelector('.input-file-label');

    if (file) {
        buttonText.textContent = file.name;

        // Verificar si el botón ya existe y eliminarlo para evitar duplicados
        let uploadBtn = document.getElementById('upload-btn');
        if (uploadBtn) uploadBtn.remove();

        // Crear botón dinámicamente
        uploadContainer.insertAdjacentHTML('beforeend', `
            <button id="upload-btn" class="upload-btn" type="button">Subir Archivo</button>
        `);

        uploadBtn = document.getElementById('upload-btn');

        // Agregar evento para subir archivo
        uploadBtn.addEventListener('click', () => {
            // Agregar animación de carga
            uploadBtn.innerHTML = '<span class="loading-spinner"></span> Subiendo...';
            uploadBtn.disabled = true;
            enviarArchivo(file);
        });
    }
});

function enviarArchivo(file) {
    let formData = new FormData();
    formData.append('file-input', file);

    fetch('/php/importarExcel.php', {
        method: 'POST',
        body: formData,
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(Error `${res.status}: ${res.statusText}`);
        }
        return res.json();
    })
    .then(data => {
        let uploadBtn = document.getElementById('upload-btn');

        if (data.errores) {
            mostrarErroresEnGrilla(data.errores);
        } else if (data.Error) {
            generateAlert("error", data.Error);
        } else {
            generateAlert("success", "¡Datos importados correctamente!");
            reiniciarFormulario();
        }

        // Restaurar botón después de la carga
        uploadBtn.innerHTML = "Subir Archivo";
        uploadBtn.disabled = false;
    })
    .catch(error => {
        console.error("Error en fetch:", error);
        generateAlert("error", "Error en la conexión o datos inválidos.");

        // Restaurar botón en caso de error
        let uploadBtn = document.getElementById('upload-btn');
        if (uploadBtn) {
            uploadBtn.innerHTML = "Subir Archivo";
            uploadBtn.disabled = false;
        }
    });
}
function generateAlert(resultado, mensaje = null) {
    if (document.getElementById("customAlert")) return;

    let texto, imagen, claseCont, claseText, clasePbar, claseBar;

    switch (resultado) {
        case "error":
            imagen = "/assets/ayuyu-angry-png.png";
            texto = mensaje || "Se produjo un error.";
            claseCont = "custom-alert custom-alert-error";
            claseText = "alert-text-error";
            clasePbar = "alert-progress-bar red1";
            claseBar = "bar-content red";
            break;
            case "success":
            imagen = "/assets/typo yukari A2.png";
            texto = mensaje || "Operación exitosa.";
            claseCont = "custom-alert custom-alert-success";
            claseText = "alert-text";
            clasePbar = "alert-progress-bar green1";
            claseBar = "bar-content green";
            break;
        case "info":
            imagen = "/assets/info-warning-alert.jpg";
            texto = mensaje || "Información importante.";
            claseCont = "custom-alert custom-alert-info";
            claseText = "alert-text-info";
            clasePbar = "alert-progress-bar blue1";
            claseBar = "bar-content blue";
            break;
        }

    alertContainer.insertAdjacentHTML('afterend', `
        <div id="customAlert" class="alert-overlay fade-in">
            <div class="${claseCont}">
                <div class="${clasePbar}"><span class="${claseBar}"></span></div>
                <img src="${imagen}" class="alert-img">
                <p class="${claseText}">${texto}</p>
            </div>
        </div>
    `);

    setTimeout(() => {
        document.getElementById("customAlert").classList.add("fade-out");
        setTimeout(() => document.getElementById("customAlert")?.remove(), 500);
    }, 4000);
}
function mostrarErroresEnGrilla(errores) {
    const main = document.querySelector('main');
    const errorLayout = document.getElementById('error-layout');
    
    main.classList.add('has-errors');
    errorLayout.classList.add('visible');
    errorLayout.innerHTML = '<h3>Errores encontrados:</h3>';

    let errorList = document.createElement('div');
    errorList.className = 'error-list';

    Object.keys(errores).forEach(fila => {
        Object.entries(errores[fila]).forEach(([campo, mensaje]) => {
            const errorItem = document.createElement('div');
            errorItem.className = 'error-item fade-in';
            errorItem.innerHTML = `
                <span class="error-fila">Fila ${fila}</span>
                <span class="error-campo">${campo.toUpperCase()}:</span>
                <span class="error-mensaje">${mensaje}</span>
            `;
            errorList.appendChild(errorItem);
        });
    });

    errorLayout.appendChild(errorList);

    let retryBtn = document.createElement('button');
    retryBtn.className = 'upload-btn';
    retryBtn.textContent = 'Reintentar importación';
    retryBtn.onclick = () => {
        generateConfirmAlert("¿Desea reintentar?", reiniciarFormulario);
    };
    errorLayout.appendChild(retryBtn);
}
function reiniciarFormulario() {
    const main = document.querySelector('main');
    const errorLayout = document.getElementById('error-layout');

    main.classList.remove('has-errors');
    errorLayout.classList.remove('visible');
    errorLayout.innerHTML = '';

    let importInput = document.getElementById('file-input');
    importInput.value = '';

    setTimeout(() => {
        importInput.value = null;
    }, 0);

    document.getElementById('input-file-label').textContent = 'Seleccionar Archivo';
    
    let uploadBtn = document.getElementById('upload-btn');
    if (uploadBtn) uploadBtn.remove();
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