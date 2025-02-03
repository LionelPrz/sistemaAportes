<?php
require '../vendor/autoload.php';
require 'conexion.php';
use PhpOffice\PhpSpreadsheet\IOFactory;

$regex = require 'expresiones.php';
$errores = [];

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file-input']) && $_FILES['file-input']['error'] === UPLOAD_ERR_OK) {
        // Ruta temporal del archivo cargado
        $fileTmpPath = $_FILES['file-input']['tmp_name'];
        $fileName = $_FILES['file-input']['name'];

        // Validar la extensión del archivo
        $allowedExtensions = ['xlsx'];
        $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);

        if (!in_array($fileExtension, $allowedExtensions)) {
            echo json_encode(["Error" => "El archivo debe ser un archivo Excel (.xlsx)"]);
            exit;
        }

        // Cargar el archivo Excel
        $spreadsheet = IOFactory::load($fileTmpPath);
        $hojaActiva = $spreadsheet->getActiveSheet();
        $datosExcel = $hojaActiva->toArray(null, true, true, true); // Leer datos como array asociativo

        $pdo->beginTransaction(); // Inicia la transacción

        // Iterar sobre las filas del Excel (omitimos la primera fila si es de encabezados)
        foreach ($datosExcel as $indiceFila => $fila) {
            if ($indiceFila < 11) continue; // Saltar encabezado
            // Almacenar los errores de cada campo en una fila
                $erroresFila = [];

            // Verificar y asignar los valores de la fila
            if(!preg_match($regex['mes'],$fila['A']??'')){
                $erroresFila['mes'] = 'Mes invalido en la fila'.$indiceFila;
            }
            if(!preg_match($regex['year'],$fila['B']??'')){
                $erroresFila['year'] = 'Año invalido en la fila'.' '.$indiceFila;
            }
            if(!preg_match($regex['cuil'],$fila['C']??'')){
                $erroresFila['cuil'] = 'Cuil invalido en la fila'.' '.$indiceFila;
            }
            if(!preg_match($regex['nombre'],$fila['D']??'')){
                $erroresFila['nombre'] = 'Nombre invalido en la fila'.' '.$indiceFila;
            }
            if(!preg_match($regex['apellido'],$fila['E']??'')){
                $erroresFila['apellido'] = 'Apellido invalido en la fila'.' '.$indiceFila;
            }
            if(!preg_match($regex['tipo_contratacion'],$fila['F']??'')){
                $erroresFila['tipo_contratacion'] = 'Tipo de contratacion invalido en la fila'.' '.$indiceFila;
            }
                if(!preg_match($regex['tipo_liquidacion'],$fila['G']??'')){
                    $erroresFila['tipo_liquidacion'] = 'Tipo de liquidacion invalido en la fila'.' '.$indiceFila;
                }
                if(!preg_match($regex['dias_trabajados'],$fila['H']??'')){
                    $erroresFila['dias_trabajados'] = 'Dias trabajados invalido en la fila'.' '.$indiceFila;
                }
                if(!preg_match($regex['categoria'],$fila['I']??'')){
                    $erroresFila['categoria'] = 'Cartegoria invalida en la fila'.' '.$indiceFila;
                }
                if(!preg_match($regex['clase'],$fila['J']??'')){
                    $erroresFila['clase'] = 'Clase invalida en la fila'.' '.$indiceFila;
                }
                if(!preg_match($regex['cargo'],$fila['K']??'')){
                    $erroresFila['cargo'] = 'Cargo invalido en la fila'.' '.$indiceFila;
                }
                if(!preg_match($regex['total_remunerativo'],$fila['L']??'')){
                    $erroresFila['total_remunerativo'] = 'Total remunerativo invalido en la fila'.' '.$indiceFila;
                }
                if(!preg_match($regex['total_no_remunerativo'],$fila['M']??'')){
                    $erroresFila['total_no_remunerativo'] = 'Total no remunerativo invalido en la fila'.' '.$indiceFila;
                }
                if(!preg_match($regex['tipo_aporte_adicional'],$fila['N']??'')){
                    $erroresFila['tipo_aporte_adicional'] = 'Tipo de aporte adicional invalido en la fila'.' '.$indiceFila;
                }
                if(!preg_match($regex['monto_aporte_adicional'],$fila['O']??'')){
                    $erroresFila['monto_aporte_adicional'] = 'Monto de aporte adicional invalido en la fila'.' '.$indiceFila;
                }
                if(!preg_match($regex['tipo_licencia'],$fila['P']??'')){
                    $erroresFila['tipo_licencia'] = 'Tipo de licencia invalido en la fila'.' '.$indiceFila;
                }
                if(!preg_match($regex['dias_licencia'],$fila['Q']??'')){
                    $erroresFila['dias_licencia'] = 'Dias de licencia invalido en la fila'.' '.$indiceFila;
                }
                // Almacenamos los errores que puede haber en las filas de datos
                if(!empty($erroresFila)){
                    $errores[$indiceFila]= $erroresFila;
                    continue;
                }

                $cuil = $fila['C'] ?? null;
                $mes = $fila['A'] ?? null;
                $year = $fila['B'] ?? null;
                $nombre = $fila['D'] ?? null;
                $apellido = $fila['E'] ?? null;
                $tipoContratacion = $fila['F'] ?? null;
                $totalRemunerativo = $fila['L'] ?? null;
                $totalNoRemunerativo = $fila['M'] ?? null;
                $tipoAporteAdicional = $fila['N'] ?? null;
                $montoAporteAdicional = $fila['O'] ?? null;
                $tipoLiquidacion = $fila['G'] ?? null;
                $tipoLicencia = $fila['P'] ?? null;
                $diasLicencia = $fila['Q'] ?? null;
                $categoria = $fila['I'] ?? null;
                $claseNivel = $fila['J'] ?? null;
                $cargoFuncion = $fila['K'] ?? null;
                $diasTrabajados = $fila['H'] ?? null;


                $cuil = str_replace('-','',$cuil);
                // Concatenacion de los valores de apellido y nombre para la bd
                $nombreCompleto = trim($nombre.' '.$apellido);
                // Formateado de los sueldos para la BD
                $totalRemunerativo =  convertirFormatoMoneda($totalRemunerativo);
                $totalNoRemunerativo  = convertirFormatoMoneda($totalNoRemunerativo);

            // Insertar en la tabla empleados
                $queryEmpleado = "INSERT INTO empleados (cuil, mes, year, nombre_completo, tipo_contratacion) VALUES (?, ?, ?, ?, ?)";
                $stmtEmpleado = $pdo->prepare($queryEmpleado);
                $stmtEmpleado->execute([$cuil, $mes, $year, $nombreCompleto, $tipoContratacion]);

            // Insertar en la tabla sueldos (si aplica)
                if ($totalRemunerativo !== null && $totalNoRemunerativo !== null) {
                    $querySueldo = "INSERT INTO sueldos (empleados, mes, year, total_remunerativo, total_no_remunerativo, tipo_aporte_adicional, monto_aporte_adicional, tipo_liquidacion) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    $stmtSueldo = $pdo->prepare($querySueldo);
                    $stmtSueldo->execute([$cuil, $mes, $year, $totalRemunerativo, $totalNoRemunerativo, $tipoAporteAdicional, $montoAporteAdicional, $tipoLiquidacion]);
            }

            // Insertar en la tabla licencias (si aplica)
            if ($tipoLicencia !== null && $diasLicencia !== null) {
                $queryLicencia = "INSERT INTO licencias (licencias, mes, year, tipo_licencia, dias_licencia) VALUES (?, ?, ?, ?, ?)";
                $stmtLicencia = $pdo->prepare($queryLicencia);
                $stmtLicencia->execute([$cuil, $mes, $year, $tipoLicencia, $diasLicencia]);
            }

            // Insertar en la tabla cargos (si aplica)
            if ($categoria !== null && $claseNivel !== null && $cargoFuncion !== null) {
                $queryCargo = "INSERT INTO cargos (asignaciones, mes, year, categoria, clase_nivel, cargo_funcion) VALUES (?, ?, ?, ?, ?, ?)";
                $stmtCargo = $pdo->prepare($queryCargo);
                $stmtCargo->execute([$cuil, $mes, $year, $categoria, $claseNivel, $cargoFuncion]);
            }

            // Insertar en la tabla contrataciones (si aplica)
            if ($diasTrabajados !== null) {
                $queryContratacion = "INSERT INTO contrataciones (contrato, mes, year, dias_trabajados) VALUES (?, ?, ?, ?)";
                $stmtContratacion = $pdo->prepare($queryContratacion);
                $stmtContratacion->execute([$cuil, $mes, $year, $diasTrabajados]);
            }
        }
        if(!empty($errores)){
            echo json_encode(["errores"=>$errores]);
        }else{
            $pdo->commit(); // Confirmar la transacción
            echo json_encode(["mensaje"=>"Datos Importados exitosamente desde el excel"]);
        }
    }
} catch (Exception $e) {
    $pdo->rollBack(); // Revertir la transacción en caso de error
    echo json_encode(["Error" => $e->getMessage()]);
}

function convertirFormatoMoneda($valorRemunerante) {
    // Eliminar el signo de dólar y espacios extra
    $valorRemunerante = str_replace(['$',' ',','],['','','#'],$valorRemunerante);
    $valorRemunerante = str_replace(['.'],['?'],$valorRemunerante);
    $valorRemunerante = str_replace(['#','?'],['.',','],$valorRemunerante);

    return $valorRemunerante;
}
?>