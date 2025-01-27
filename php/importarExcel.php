<?php
require '../vendor/autoload.php';
require 'conexion.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

try {
    // Cargar el archivo Excel
    $archivoExcel = 'ruta_del_archivo.xlsx'; // Cambia a la ruta de tu archivo
    $spreadsheet = IOFactory::load($archivoExcel);
    $hojaActiva = $spreadsheet->getActiveSheet();
    $datosExcel = $hojaActiva->toArray(null, true, true, true); // Leer datos como array asociativo

    $pdo->beginTransaction(); // Inicia la transacción

    // Iterar sobre las filas del Excel (omitimos la primera fila si es de encabezados)
    foreach ($datosExcel as $indiceFila => $fila) {
        if ($indiceFila === 1) continue; // Saltar encabezado

        // Verificar y asignar los valores de la fila
        $cuil = $fila['A'] ?? null;
        $mes = $fila['B'] ?? null;
        $year = $fila['C'] ?? null;
        $nombreCompleto = $fila['D'] ?? null;
        $tipoContratacion = $fila['E'] ?? null;
        $totalRemunerativo = $fila['F'] ?? null;
        $totalNoRemunerativo = $fila['G'] ?? null;
        $tipoAporteAdicional = $fila['H'] ?? null;
        $montoAporteAdicional = $fila['I'] ?? null;
        $tipoLiquidacion = $fila['J'] ?? null;
        $tipoLicencia = $fila['K'] ?? null;
        $diasLicencia = $fila['L'] ?? null;
        $categoria = $fila['M'] ?? null;
        $claseNivel = $fila['N'] ?? null;
        $cargoFuncion = $fila['O'] ?? null;
        $diasTrabajados = $fila['P'] ?? null;

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

    $pdo->commit(); // Confirmar la transacción
    echo json_encode("Datos importados exitosamente desde Excel");
} catch (Exception $e) {
    $pdo->rollBack(); // Revertir la transacción en caso de error
    echo json_encode(["Error" => $e->getMessage()]);
}
?>