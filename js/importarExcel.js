// Seccion para el manejo del aside
let botonesCategorias = document.querySelectorAll('.boton-aside');

botonesCategorias.forEach(boton=>{
    boton.addEventListener('click',(e)=>{
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");
    })
})

document.addEventListener('DOMContentLoaded', () => {
    // Elementos actualizados
    const elements = {
        mainButton: document.getElementById('mainButton'),
        uploadButton: document.getElementById('uploadButton'), // Nuevo botón
        fileInput: document.getElementById('file-input'),
        errorPanel: document.getElementById('errorPanel'),
        errorList: document.getElementById('errorList'),
        retryBtn: document.getElementById('retryBtn'),
        terminalContainer: document.getElementById('buttonContainer'),
        importContainer: document.getElementById('importContainer')
    };

    // Estado mejorado
    let state = {
        currentFile: null,
        errors: [],
        isUploading: false,
        hasErrors: false
    };

    // Eventos
    elements.mainButton.addEventListener('click', () => elements.fileInput.click()); // Cambio aquí
    elements.uploadButton.addEventListener('click', handleUpload);
    elements.fileInput.addEventListener('change', updateFileState); // Y aquí
    elements.retryBtn.addEventListener('click', handleRetry);

    async function handleUpload() {
        if (!state.currentFile || state.isUploading) return;
        
        try {
            state.isUploading = true;
            updateLoadingState(true);
            
            const formData = new FormData();
            formData.append('file-input', state.currentFile);
            
            const response = await fetch('/php/importarExcel.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            handleServerResponse(data);
            
        } catch (error) {
            handleUploadError(error.message);
        } finally {
            state.isUploading = false;
            updateLoadingState(false);
        }
    }

    function handleServerResponse(data) {
        if (data.errores && Object.keys(data.errores).length > 0) {
            state.errors = processErrors(data.errores);
            state.hasErrors = true;
            showErrorPanel();
            generateAlert('warning', 'Se encontraron errores en el archivo');
        } else if (data.Error) {
            handleUploadError(data.Error);
        } else {
            handleSuccess();
        }
    }

    function processErrors(errors) {
        return Object.entries(errors).flatMap(([fila, campos]) => 
            Object.entries(campos).map(([campo, mensaje]) => ({
                fila,
                campo,
                mensaje
            }))
        );
    }
    function handleSuccess() {
        generateAlert('success', '¡Archivo importado correctamente!');
        resetState();
    }

    function handleUploadError(error) {
        generateAlert('error', error);
        console.log(error);
        resetState();
    }

    function updateFileState(e) {
        state.currentFile = e.target.files[0];
        if (state.currentFile) {
            elements.uploadButton.style.display = 'flex';
            elements.mainButton.textContent = `📁 ${state.currentFile.name}`;
        }
        updateUIState();
    }

    function handleRetry() {
        generateConfirmAlert('¿Desea reintentar la carga del archivo?', () => {
            resetState();
            elements.fileInput.click();
        });
    }

    function updateUIState() {
        elements.mainButton.disabled = state.isUploading;
        elements.uploadButton.disabled = state.isUploading || !state.currentFile;
        elements.retryBtn.style.display = state.hasErrors ? 'flex' : 'none';
    }

    function updateLoadingState(isLoading) {
        elements.uploadButton.innerHTML = isLoading 
            ? '<span class="terminal-loader"></span>' 
            : 'Subir Archivo';
        updateUIState();
    }
    // Sistema de alertas mejorado
    function generateAlert(type, message) {
        const alertConfig = {
            error: {
                img: "/assets/ayuyu-angry-png.png",
                class: "error",
                title: "Error"
            },
            success: {
                img: "/assets/typo-yukari-a2.png",
                class: "success",
                title: "Éxito"
            },
            warning: {
                img: "/assets/info-warning-alert.jpg",
                class: "warning",
                title: "Advertencia"
            }
        }[type];

        const alertHTML = `
            <div class="alert-overlay ${alertConfig.class}">
                <div class="alert-content">
                    <img src="${alertConfig.img}" class="alert-img" alt="${alertConfig.title}">
                    <div class="alert-text">
                        <h3>${alertConfig.title}</h3>
                        <p>${message}</p>
                    </div>
                    <div class="alert-progress"></div>
                </div>
            </div>
        `;

        elements.importContainer.insertAdjacentHTML('beforeend', alertHTML);
        setTimeout(() => document.querySelector('.alert-overlay').remove(), 3500);
    }

    function generateConfirmAlert(message, confirmCallback) {
        // Crear el contenedor del alert
        const alertContainer = document.createElement('div');
        alertContainer.className = 'alert-overlay confirm';
        
        // Crear el contenido del alert
        alertContainer.innerHTML = `
            <div class="alert-content">
                <img src="/assets/info-warning-alert.jpg" class="alert-image" alt="imagen mamalona">
                <div class="alert-text">
                    <h3>Aviso</h3>
                    <p>${message}</p>
                </div>
                <div class="alert-actions">
                    <button class="confirm-btn">Si porfavor</button>
                    <button class="cancel-btn">No gracias</button>
                </div>
            </div>
        `;
    
        // Insertar en el DOM
        elements.importContainer.appendChild(alertContainer);
    
        // Manejar clics en los botones
        const confirmBtn = alertContainer.querySelector('.confirm-btn');
        const cancelBtn = alertContainer.querySelector('.cancel-btn');
    
        confirmBtn.addEventListener('click', () => {
            confirmCallback();
            removeAlert(alertContainer);
        });
    
        cancelBtn.addEventListener('click', () => {
            removeAlert(alertContainer);
        });
    
        // Función para remover el alert con animación
        function removeAlert(alertElement) {
            alertElement.classList.add('removing');
            setTimeout(() => {
                alertElement.remove();
            }, 300); // Coincide con la duración de la animación CSS
        }
    }
    function showErrorPanel() {
        // Verificar existencia de elementos
        if (!elements.errorPanel || !elements.errorList) {
            console.error('Elementos del panel de errores no encontrados');
            return;
        }
    
        try {
            elements.errorPanel.classList.add('visible');
            elements.terminalContainer.classList.add('hidden');
            elements.errorList.innerHTML = state.errors.map(error => `
                <div class="error-item">
                    <span class="error-fila">Fila ${error.fila}</span>
                    <span class="error-campo">${error.campo}:</span>
                    <span class="error-mensaje">${error.mensaje}</span>
                </div>
            `).join('');
            
            updateUIState();
        } catch (error) {
            console.error('Error al mostrar errores:', error);
            generateAlert('error', 'Error al procesar los errores');
        }
    }
    
    function resetState() {
        try {
            state.currentFile = null;
            state.errors = [];
            state.hasErrors = false;
            
            if (elements.fileInput) elements.fileInput.value = '';
            if (elements.uploadButton) elements.uploadButton.style.display = 'none';
            if (elements.errorPanel) elements.errorPanel.classList.remove('visible');
            if (elements.mainButton) {
                elements.mainButton.textContent = 'Seleccionar Archivo';
                elements.terminalContainer.classList.remove('hidden');
            }
                
            
            // Limpiar lista de errores de forma segura
            if (elements.errorList) elements.errorList.innerHTML = '';
            
            updateUIState();
        } catch (error) {
            console.error('Error al resetear estado:', error);
            generateAlert('error', 'Error al reiniciar el sistema');
        }
    }
    
    function updateUIState() {
        try {
            if (elements.mainButton) {
                elements.mainButton.disabled = state.isUploading;
            }
            
            if (elements.uploadButton) {
                elements.uploadButton.disabled = state.isUploading || !state.currentFile;
            }
            
            if (elements.retryBtn) {
                elements.retryBtn.style.display = state.hasErrors ? 'flex' : 'none';
            }
        } catch (error) {
            console.error('Error al actualizar UI:', error);
        }
    }
    
    function updateLoadingState(isLoading) {
        if (!elements.uploadButton) return;
        
        try {
            elements.uploadButton.innerHTML = isLoading 
                ? '<span class="terminal-loader"></span>' 
                : 'Subir Archivo';
                
            updateUIState();
        } catch (error) {
            console.error('Error al actualizar estado de carga:', error);
            generateAlert('error', 'Error en la interfaz de carga');
        }
    }
});