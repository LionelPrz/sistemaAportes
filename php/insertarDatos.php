<?php
// Incluir conexión a la base de datos
include 'conexion.php';

$_POST = json_decode(file_get_contents('php://input'), true);

try {
    $pdo->beginTransaction(); // Inicia la transacción

    if (is_array($_POST)) {
        foreach ($_POST as $registro) {
            // Validar existencia de la clave 'empleados'
            if (isset($registro['empleados']) && is_array($registro['empleados'])) {
                $empleado = $registro['empleados'];

                // Validar campos del empleado
                if (isset($empleado['cuil'], $empleado['nombre_completo'], $empleado['tipo_contratacion'])) {
                    $queryEmpleado = "INSERT INTO empleados(cuil, nombre_completo, tipo_contratacion) VALUES (?, ?, ?)";
                    $stmtEmpleado = $pdo->prepare($queryEmpleado);
                    $stmtEmpleado->execute([
                        $empleado['cuil'],
                        $empleado['nombre_completo'],
                        $empleado['tipo_contratacion']
                    ]);
                } else {
                    throw new Exception("Error: datos incompletos para 'empleados'.");
                }
            } else {
                throw new Exception("Error: no se encontró la clave 'empleados' o no es válida.");
            }

            // Procesar sueldos
            if (isset($registro['sueldos']) && is_array($registro['sueldos'])) {
                $sueldo = $registro['sueldos'];
                if (isset($sueldo['total_remunerativo'], $sueldo['total_no_remunerativo'], $sueldo['tipo_aporte_adicional'], $sueldo['monto_aporte_adicional'])) {
                    $querySueldo = "INSERT INTO sueldos(empleados, total_remunerativo, total_no_remunerativo, tipo_aporte_adicional, monto_aporte_adicional,tipo_liquidacion)
                                    VALUES (?, ?, ?, ?, ?, ?)";
                    $stmtSueldo = $pdo->prepare($querySueldo);
                    $stmtSueldo->execute([
                        $empleado['cuil'], // Relación con empleado
                        $sueldo['total_remunerativo'],
                        $sueldo['total_no_remunerativo'],
                        $sueldo['tipo_aporte_adicional'],
                        $sueldo['monto_aporte_adicional'],
                        $sueldo['tipo_liquidacion']
                    ]);
                } else {
                    throw new Exception("Error: datos incompletos en 'sueldos'.");
                }
            }

            // Procesar licencias
            if (isset($registro['licencias']) && is_array($registro['licencias'])) {
                $licencia = $registro['licencias'];
                if (isset($licencia['tipo_licencia'], $licencia['dias_licencia'])) {
                    $queryLicencia = "INSERT INTO licencias(licencias, tipo_licencia, dias_licencia) VALUES (?, ?, ?)";
                    $stmtLicencia = $pdo->prepare($queryLicencia);
                    $stmtLicencia->execute([
                        $empleado['cuil'],
                        $licencia['tipo_licencia'],
                        $licencia['dias_licencia']
                    ]);
                } else {
                    throw new Exception("Error: datos incompletos en 'licencias'.");
                }
            }

            // Procesar cargos
            if (isset($registro['cargos']) && is_array($registro['cargos'])) {
                $cargo = $registro['cargos'];
                if (isset($cargo['categoria'], $cargo['clase'], $cargo['cargo'])) {
                    $queryCargo = "INSERT INTO cargos(asignaciones, categoria, clase_nivel, cargo_funcion) VALUES (?, ?, ?, ?)";
                    $stmtCargo = $pdo->prepare($queryCargo);
                    $stmtCargo->execute([
                        $empleado['cuil'],
                        $cargo['categoria'],
                        $cargo['clase'],
                        $cargo['cargo']
                    ]);
                } else {
                    throw new Exception("Error: datos incompletos en 'cargos'.");
                }
            }

            // Procesar contrataciones
            if (isset($registro['contrataciones']) && is_array($registro['contrataciones'])) {
                $contrato = $registro['contrataciones'];
                if (isset($contrato['mes'], $contrato['año'], $contrato['dias_trabajados'])) {
                    $queryContratacion = "INSERT INTO contrataciones(contrato, mes, year, dias_trabajados) VALUES (?, ?, ?, ?)";
                    $stmtContratacion = $pdo->prepare($queryContratacion);
                    $stmtContratacion->execute([
                        $empleado['cuil'],
                        $contrato['mes'],
                        $contrato['año'],
                        $contrato['dias_trabajados']
                    ]);
                } else {
                    throw new Exception("Error: datos incompletos en 'contrataciones'.");
                }
            }
        }

        $pdo->commit(); // Confirmar la transacción
        echo json_encode("Exito");
    } else {
        throw new Exception("Error: el cuerpo de la solicitud no es un array.");
    }
} catch (Exception $e) {
    $pdo->rollBack(); // Revertir la transacción si hay un error
    echo json_encode(["Error" => $e->getMessage()]);
}
?>