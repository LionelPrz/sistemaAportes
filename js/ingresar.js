let form = document.querySelector(".form");
let Scontratacion = document.getElementById("contratacion");
let Sliquidacion = document.getElementById("liquidacion");
let SaporteAdd = document.getElementById("aporte_adicional");
let SmontoApt = document.getElementById("monto_aporte_adicional");
let Stlicencia = document.getElementById("licencia");
let Smes = document.getElementById("mes");
let inputs = document.querySelectorAll("#form input,select");
let botonNext = document.getElementById("next-btn");
let botonSmt = document.getElementById("btn-submit");
let contador = 0;
let contenedorDatos = [];
let valorForm;

const expresiones = {
  cuil: /^\d{11}$/,
  nombre: /^[a-zA-ZÀ-ÿ\s]{1,20}$/,
  apellido: /^[a-zA-ZÀ-ÿ\s]{1,20}$/,
  tipo_contratacion: /^(1|2|3|4|5)$/,
  tipo_liquidacion: /^(1|2|3)$/,
  dias_trabajados: /^([0-9]|[1-2][0-9]|3[0])$/,
  cargo: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
  clase: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
  categoria: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
  total_remunerativo: /^\d{1,3}(\.\d{3})*(,\d{1,2})?$/,
  total_no_remunerativo: /^\d{1,3}(\.\d{3})*(,\d{1,2})?$/,
  tipo_aporte_adicional: /^\$-$/,
  monto_aporte_adicional: /^\$-$/,
  tipo_licencia: /^(1|2|3)$/,
  dias_licencia: /^([0-9]|[1-2][0-9]|3[0-1])$/,
  mes: /^(1|2|3|4|5|6|7|8|9|10|11|12)$/,
  year: /^(19[0-9]{2}|20[0-9]{2})$/,
  // input: /^([1-9][0-9])$/
  input: /^(10|[1-9])$/
};

const campos = {
  cuil: false,
  nombre: false,
  apellido: false,
  tipo_contratacion: false,
  tipo_liquidacion: false,
  dias_trabajados: false,
  cargo: false,
  clase: false,
  categoria: false,
  total_remunerativo: false,
  total_no_remunerativo: false,
  tipo_aporte_adicional: false,
  monto_aporte_adicional: false,
  tipo_licencia: false,
  dias_licencia: false,
  tipo_liquidacion: false,
  mes: false,
  year: false,
  input: false,
  ejecucion: false,
};

const categorias = {
  empleados:["cuil","mes","year","nombre","apellido","tipo_contratacion"],
  sueldos: ["total_remunerativo","total_no_remunerativo","tipo_aporte_adicional","monto_aporte_adicional","tipo_liquidacion"],
  licencias: ["tipo_licencia","dias_licencia"],
  cargos: ["cargo","clase","categoria"],
  contrataciones: ["mes","year","dias_trabajados"]

};

inputs.forEach((input) => {
  input.addEventListener("keyup", validarFormulario);
  input.addEventListener("blur", validarFormulario);
  input.addEventListener("change", validarFormulario);
});
form.addEventListener("click", () => {
  rellenarSelects();
});
window.addEventListener("load", () => {
  generateAlert("info");
});
botonNext.addEventListener("click", (e) => {
  e.preventDefault();
  if (Object.values(campos).every((campo) => campo)) {
    cargarFormulario();
    console.log(contador);
    comprobarEstadoCarga(contador);
  }
});
botonSmt.addEventListener("click", (e) => {
  e.preventDefault();
  validadorFinal(contador,valorForm.value,contenedorDatos);
});
function validarFormulario(e) {
  switch (e.target.name) {
    // Validacion cuil
    case "cuil":
      validarCampo(expresiones.cuil, e.target, "cuil");
      break;
    // Validacion Nombre
    case "nombre":
      validarCampo(expresiones.nombre, e.target, "nombre");
      break;
    // Validacion Apellido
    case "apellido":
      validarCampo(expresiones.apellido, e.target, "apellido");
      break;
    // Validacion Tipo contratacion
    case "tipo_contratacion":
      validarCampo(
        expresiones.tipo_contratacion,
        e.target,
        "tipo_contratacion"
      );
      break;
    // Validacion Tipo liquidacion
    case "tipo_liquidacion":
      validarCampo(expresiones.tipo_liquidacion, e.target, "tipo_liquidacion");
      break;
    // Validacion Dias trabajados
    case "dias_trabajados":
      validarCampo(expresiones.dias_trabajados, e.target, "dias_trabajados");
      break;
    // Validacion Cargo
    case "cargo":
      validarCampo(expresiones.cargo, e.target, "cargo");
      break;
    // Validacion Clase
    case "clase":
      validarCampo(expresiones.clase, e.target, "clase");
      break;
    // Validacion categoria
    case "categoria":
      validarCampo(expresiones.categoria, e.target, "categoria");
      break;
    // Validacion Total remunerativo
    case "total_remunerativo":
      validarCampo(
        expresiones.total_remunerativo,
        e.target,
        "total_remunerativo"
      );
      break;
    // Validacion Total no remunerativo
    case "total_no_remunerativo":
      validarCampo(
        expresiones.total_no_remunerativo,
        e.target,
        "total_no_remunerativo"
      );
      break;
    // Validacion Aporte adicional
    case "tipo_aporte_adicional":
      validarCampo(
        expresiones.tipo_aporte_adicional,
        e.target,
        "tipo_aporte_adicional"
      );
      break;
    // Validacion Monto del aporte
    case "monto_aporte_adicional":
      validarCampo(
        expresiones.monto_aporte_adicional,
        e.target,
        "monto_aporte_adicional"
      );
      break;
    // Validacion Tipo licencia
    case "tipo_licencia":
      validarCampo(expresiones.tipo_licencia, e.target, "tipo_licencia");
      break;
    // Validacion Dias licencia
    case "dias_licencia":
      validarCampo(expresiones.dias_licencia, e.target, "dias_licencia");
      break;
    // Validacion Año
    case "year":
      validarCampo(expresiones.year, e.target, "year");
      break;
    // Validacion Mes
    case "mes":
      validarCampo(expresiones.mes, e.target, "mes");
      break;
  }
  // Ocultar mensaje de advertencia si todos los campos son válidos
  if (Object.values(campos).every((campo) => campo)) {
    document
      .getElementById("formulario__mensaje")
      .classList.remove("formulario__mensaje-activo");
  }
}
function validarCampo(expresion, input, campo) {
  if (expresion.test(input.value)) {
    document
      .getElementById(`grupo__${campo}`)
      .classList.remove("formulario__grupo-incorrecto");
    document
      .getElementById(`grupo__${campo}`)
      .classList.add("formulario__grupo-correcto");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.add("fa-check-circle");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.remove("fa-times-circle");
    document
      .querySelector(`#grupo__${campo} .formulario__input-error`)
      .classList.remove("formulario__input-error-activo");
    campos[campo] = true;
  } else {
    document
      .getElementById(`grupo__${campo}`)
      .classList.add("formulario__grupo-incorrecto");
    document
      .getElementById(`grupo__${campo}`)
      .classList.remove("formulario__grupo-correcto");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.add("fa-times-circle");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.remove("fa-check-circle");
    document
      .querySelector(`#grupo__${campo} .formulario__input-error`)
      .classList.add("formulario__input-error-activo");
    campos[campo] = false;
  }
}
function rellenarSelects() {
  if (!campos.ejecucion) {
    // limmpieza de las opciones anteriores
    SaporteAdd.innerHTML = "";
    Sliquidacion.innerHTML = "";
    Smes.innerHTML = "";
    SmontoApt.innerHTML = "";
    Stlicencia.innerHTML = "";
    SaporteAdd.insertAdjacentHTML(
      "beforeend",
      `
            <option disabled selected>Tipo aporte adicional</option>
            <option value="$-">$-</option>
    `
    );
    Sliquidacion.insertAdjacentHTML(
      "beforeend",
      `
            <option disabled selected>Tipo de liquidacion</option>
            <option value="1">Normal</option>
            <option value="2">SAC</option>
            <option value="3">Especial</option>
    `
    );
    Smes.insertAdjacentHTML(
      "beforeend",
      `
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

    `
    );
    SmontoApt.insertAdjacentHTML(
      "beforeend",
      `
            <option disabled selected>Tipo aporte adicional</option>
            <option value="$-">$-</option>
    `
    );
    Stlicencia.insertAdjacentHTML(
      "beforeend",
      `
            <option disabled selected>Tipo de licencia</option>
            <option value="1">Con goce integro de haberes</option>
            <option value="2">Con goce parcial de haberes</option>
            <option value="3">Sin goce</option>
    `
    );
    Scontratacion.insertAdjacentHTML(
      "beforeend",
      `
            <option disabled selected>Tipo de contratacion</option>
            <option value="1">Planta permanente</option>
            <option value="2">Planta politica</option>
            <option value="3">Contratados</option>
            <option value="4">Ad honorem</option>
            <option value="5">Jornalizado</option>
    `
    );
    campos.ejecucion = true;
  }
}
function generateAlert(resultado, mensaje = null) {
  // Validacion precencia para evitar duplicados
  if (document.getElementById("customAlert")) return;

  // declaracion de variables
  let texto;
  let imagen;
  let claseCont = "custom-alert";
  let clasePbar = "alert-progress-bar";
  let claseBar = "bar-content";
  let inputBar = "alert-input";
  let botonInput = "boton-input";

  // Comprobacion de resultado

  switch (resultado) {
    case "error":
      // Generacion del alert de error
      imagen = "/assets/ayuyu-angry-png.png";
      texto = mensaje || "Se produjo un error al enviar los datos !";
      claseText = "alert-text-error";
      clasePbar = "alert-progress-bar  red1";
      claseBar = "bar-content red";
      claseCont += " custom-alert-error";
      break;

    case "success":
      // Generacion del alert de exito
      imagen = "/assets/boochi-nato-png.png";
      texto = mensaje || "Formulario enviado Correctamente";
      claseCont += " custom-alert-success";
      clasePbar = "alert-progress-bar green1";
      claseBar = "bar-content green";
      break;

    case "info":
      // Generacion del alert de informacion
      imagen = "/assets/info-warning-alert.jpg";
      claseText = "alert-text-info";
      texto = mensaje || "Ingrese las filas a cargar!";
      claseCont += " custom-alert-info";
      clasePbar = "alert-progress-bar blue1";
      claseBar = "bar-content blue";
      break;
  }

  // Generar el elemento de manera dinamica y insertarlo despues del boton
  botonNext.insertAdjacentHTML(
    "afterend",
    `
            <div class="formulario__grupo" id="grupo__input">
                <div id="customAlert" class="alert-overlay">
                    <div class="${claseCont}">
                    <div class="${clasePbar}">
                    <span class="${claseBar}"></span>
                </div>
                    <img src="${imagen}" class="alert-img" alt="imagen mamalona">
                    <div class="text-input-container">
                            <label class="formulario__label" for="year">${texto}</label>
                        <div class="formulario__grupo-input">
                            <input class="${inputBar}" type="tel" id="alert-input" name="input" required>
                            <i class="formulario__validacion-estado fas fa-times-circle"></i>
                        </div>
                        <button class="${botonInput}" type="button" id="boton-input">Aceptar</button>
                    </div>
                    <p class="formulario__input-error">Ingrese un numero dentro del rango 10 a 90!</p>
                </div>
                </div>
            </div>
            `
  );

  const idCont = document.getElementById("customAlert");
  const idbtnaccept = document.getElementById("boton-input");
  idCont.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  idbtnaccept.addEventListener("click", () => {
    valorForm = document.getElementById("alert-input");
    validarCampo(expresiones.input, valorForm, "input");
    if (campos.input === true) {
      idCont.remove();
    }
  });
}
function cargarFormulario() {
  let datosFormulario = new FormData(form);
  let objetoClasificado = Object.keys(categorias).reduce((acc, categoria) => {
    acc[categoria] = {}; // Inicializa las categorías vacías
    return acc;
  }, {});

  datosFormulario.forEach((value, key) => {
    // Iterar sobre cada categoría para agrupar
    Object.entries(categorias).forEach(([categoria, campos]) => {
      if (campos.includes(key)) {
        // Parsear los valores que deben ser enteros
        if ( key === "empleados" || key === "mes" || key === "dias_trabajados" || key === "dias_licencia" || key === "tipo_licencia" || key === "tipo_contratacion" || key === "tipo_liquidacion" || key === "year") {
          value = parseInt(value, 10);
        }

        // Agrupar nombre y apellido para la categoría empleados
        if (key === "nombre" || key === "apellido") {
          objetoClasificado.empleados.nombre_completo = objetoClasificado.empleados.nombre_completo 
            ? `${objetoClasificado.empleados.nombre_completo} ${value}` 
            : value;
        } else {
          // // Para las demás categorías, asociar mes y año
          // if (["sueldos", "licencias", "cargos", "contrataciones"].includes(categoria)) {
          // }
          // Agregar el valor a la categoría correspondiente
          objetoClasificado[categoria][key === "year" ? "year" : key] = value;
        }

        // Asociar el cuil a todas las categorías que lo necesiten
        if (["sueldos", "licencias", "cargos", "contrataciones"].includes(categoria)) {
          let cuilParseado = datosFormulario.get("cuil");
         // Ajustar la clave compuesta para cuil, mes y año
        objetoClasificado[categoria].empleados = {
          cuil: cuilParseado,
          mes: parseInt(datosFormulario.get("mes"), 10),
          year: parseInt(datosFormulario.get("year"), 10)
    };

        }
      }
    });
  });

  // Agregar el objeto clasificado al contenedor de datos
  contenedorDatos.push(objetoClasificado);
  console.log("Datos Clasificados:", objetoClasificado);
  contador++;
}
function comprobarEstadoCarga(estado) {
  if (estado < valorForm.value) {
    reseteoFormulario();
  }else{
      botonNext.style.display = "none";
      botonSmt.style.display = "block";
}
}
function validadorFinal(estado1, estado2, contenido) {
  if (estado1.value === estado2.value) {
    fetch("/php/insertarDatos.php", {
      method: "POST",
      body: JSON.stringify(contenido),
      ContentType: 'application/json',
    })
      .then((res) => res.json())
      .then((data) => {
        generateAlert("success","Insercion Exitosa!");
        console.log(data);
      })
      .catch((error) => {
        generateAlert("error", error);
      });
  } else {
    document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-activo');
  }
}
function reseteoFormulario() {
  form.reset();

  // Reinicio los estados de los campos y sus estilos
  document.querySelectorAll(".formulario__grupo-correcto").forEach((icono) => {
    icono.classList.remove("formulario__grupo-correcto");
    icono.classList.remove("formulario__grupo-incorrecto");
  });

  // Ocultar el mensaje de error si es que estubiera activo
  document
    .getElementById("formulario__mensaje")
    .classList.remove("formulario__mensaje-activo");

}