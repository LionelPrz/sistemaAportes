let form = document.querySelector(".form");
let Scontratacion = document.getElementById('contratacion');
let Sliquidacion = document.getElementById('liquidacion');
let Scargo = document.getElementById('cargo');
let Scategoria = document.getElementById('categoria');
let Sclase = document.getElementById('clase');
let SaporteAdd = document.getElementById('aporte_adicional');
let SmontoApt = document.getElementById('monto_aporte');
let Stlicencia = document.getElementById('licencia');
let Smes = document.getElementById('mes');
let inputs = document.querySelectorAll('#form input,select');

const expresiones = {
    nombre: /^[a-zA-ZÀ-ÿ\s]{1,20}$/,
    apellido: /^[a-zA-ZÀ-ÿ\s]{1,20}$/,
    cuil: /^\d{11}$/,
    cargo:/^(Intendente|Viceintendente|Administrativo)$/,
    categoria: /^(Intendente|Viceintendente|Administrativo)$/,
    clase: /^(Intendente|Viceintendente|Administrativo)$/,
    aporte_adicional:/^($-)$/,
    monto_aporte:/^($-)$/,
    tipo_licencia:/^(1|2|3)$/,
    tipo_liquidacion: /^(1|2|3)$/,
    mes:/^(1|2|3|4|5|6|7|8|9|10|11|12)$/
};

const campos = {
    nombre: false,
    apellido: false,
    cuil: false,
    cargo: false,
    categoria: false,
    clase: false,
    aporte_adicional: false,
    monto_aporte: false,
    tipo_licencia: false,
    tipo_liquidacion: false,
    mes: false,
};

inputs.forEach((input)=>{
    input.addEventListener('keyup',validarFormulario);
    input.addEventListener('blur',validarFormulario);
    input.addEventListener('change',validarFormulario);
});

form.addEventListener('click',()=>{
    if(!campos.ejecucion){
        // limmpieza de las opciones anteriores
        SaporteAdd.innerHTML = '';
        Scargo.innerHTML = '';
        Scategoria.innerHTML = '';
        Sclase.innerHTML = '';
        Sliquidacion.innerHTML = '';
        Smes.innerHTML = '';
        SmontoApt.innerHTML = '';
        SmontoApt.innerHTML = '';
        Stlicencia.innerHTML = '';

        SaporteAdd.insertAdjacentHTML('beforeend',`
            <option disabled selected>Tipo aporte adicional</option>
            <option value="$-">$-</option>
    `);
        Scargo.insertAdjacentHTML('beforeend',`
            <option disabled selected>Cargo asignado</option>
            <option value="Intendente">Intendente</option>
            <option value="Viceintendente">Viceintendente</option>
            <option value="Administrativo">Administrativo</option>
    `);
        Scategoria.insertAdjacentHTML('beforeend',`
            <option disabled selected>Cateoria asignada</option>
            <option value="Intendente">Intendente</option>
            <option value="Viceintendente">Viceintendente</option>
            <option value="Administrativo">Administrativo</option>
    `);
        Sclase.insertAdjacentHTML('beforeend',`
            <option disabled selected>Clase asignada</option>
            <option value="Intendente">Intendente</option>
            <option value="Viceintendente">Viceintendente</option>
            <option value="Administrativo">Administrativo</option>
    `);
        Sliquidacion.insertAdjacentHTML('beforeend',`
            <option disabled selected>Tipo de liquidacion</option>
            <option value="1">Normal</option>
            <option value="2">SAC</option>
            <option value="3">Especial</option>
    `);
        Smes.insertAdjacentHTML('beforeend',`
            <option disabled selected>Mes del año</option>
            <option value="1">Enero</option>
            <option value="2">Febrero</option>
            <option value="3">Marzo</option>
            <option value="4">Abril</option>
            <option value="5">Mayo</option>
            <option value="6">Junio</option>
            <option value="7">Julio</option>
            <option value="8">Agosto</option>
            <option value="9">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>

    `);
        SmontoApt.insertAdjacentHTML('beforeend',`
            <option disabled selected>Monto del Aporte</option>
            <option value="$-">$-</option>
    `);
        Stlicencia.insertAdjacentHTML('beforeend',`
            <option disabled selected>Tipo de licencia</option>
            <option value="1">Con goce integro de haberes</option>
            <option value="2">Con goce parcial de haberes</option>
            <option value="3">Sin goce</option>
    `);
        Scontratacion.insertAdjacentHTML('beforeend',`
            <option disabled selected>Tipo de contratacion</option>
            <option value="1">Planta Permanente</option>
            <option value="2">Planta Politica</option>
            <option value="3">Contratados</option>
            <option value="4">Ad honorem</option>
            <option value="5">Jornalizado</option>
    `);
        campos.ejecucion = true;
    }
});


function validarFormulario(e){
    switch(e.target.name){
        case "nombre":
            validarCampo(expresiones.nombre,e.target,'nombre');
        break;
        case "apellido":
            validarCampo(expresiones.apellido,e.target,'apellido');
        break;
        case "cuil":
            validarCampo(expresiones.cuil,e.target,'cuil');
        break;
        case "cargo_funcion":
            validarCampo(expresiones.cargo,e.target,'cargo_funcion');
        break;
        case "clase_nivel":
            validarCampo(expresiones.clase,e.target,'clase_nivel');
        break;
        case "categoria_agrupacion":
            validarCampo(expresiones.categoria,e.target,'categoria_agrupacion');
        break;
        case "monto_aporte_adicional":
            validarCampo(expresiones.monto_aporte,e.target,'monto_aporte_adicional');
        break;
        case "tipo_aporte_adicional":
            validarCampo(expresiones.aporte_adicional,e.target,'tipo_aporte_adicional');
        break;
        case "tipo_licencia":
            validarCampo(expresiones.tipo_licencia,e.target,'tipo_licencia');
        break;
        case "mes":
            validarCampo(expresiones.mes,e.target,'mes');
        break;
    }
    // Ocultar mensaje de advertencia si todos los campos son válidos
    if (Object.values(campos).every((campo) => campo)) {
        document.getElementById('formulario__mensaje').classList.remove('formulario__mensaje-activo');
    }
}

function validarCampo(expresion,input,campo){
    if(expresion.test(input.value)){
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
		document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
		document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
		campos[campo] = true;
    }
    else{
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
		document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
		document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
		campos[campo] = false;
    }
}