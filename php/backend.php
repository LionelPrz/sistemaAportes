<?php
// Incluir conexión a la base de datos
include 'conexion.php';

$_POST = json_decode(file_get_contents('php://input'), true);

try {
    if (is_array($_POST)) {
        foreach ($_POST as $registro) {
            // Validar existencia de la clave 'empleados'
            if (isset($registro['empleados'])) {
                $empleado = $registro['empleados'];

                // Validar que los campos requeridos estén presentes
                if (isset($empleado['cuil'], $empleado['nombre_completo'], $empleado['tipo_contratacion'])) {
                    // Lógica para insertar empleados
                    $queryEmpleado = "INSERT INTO empleados(cuil, nombre_completo, tipo_contratacion) VALUES (?, ?, ?)";
                    $stmtEmpleado = $pdo->prepare($queryEmpleado);
                    // Enlazar los valores de la sentencia con los tipos correctos
                    $stmtEmpleado->bindParam(1, $empleado['cuil'], PDO::PARAM_INT);
                    $stmtEmpleado->bindParam(2, $empleado['nombre_completo'], PDO::PARAM_STR);
                    $stmtEmpleado->bindParam(3, $empleado['tipo_contratacion'], PDO::PARAM_INT);
                    // Ejecutar la inserción
                    $stmtEmpleado->execute();

                    echo json_encode("Exito");
                } else {
                    echo json_encode("Error: datos incompletos para el empleado!");
                }
            } else {
                echo json_encode("Error: no se encontró la clave 'empleados' en el registro!");
            }
        }
    } else {
        echo json_encode("Error: el cuerpo de la solicitud no es un array.");
    }
} catch (Exception $e) {
    echo json_encode(["Error".$e->getMessage()]);
}

    //         // Validar y procesar 'sueldos'
    //         if (isset($registro['sueldos'])) {
    //             $sueldo = $registro['sueldos'];
    //             if (isset($sueldo['total_remunerativo'], $sueldo['empleados'])) {
    //                 // Lógica para insertar sueldos
    //             }
    //         }
    
    //         // Validar y procesar 'licencias'
    //         if (isset($registro['licencias'])) {
    //             $licencia = $registro['licencias'];
    //             if (isset($licencia['tipo_licencia'], $licencia['empleados'], $licencia['dias_licencia'])) {
    //                 // Lógica para insertar licencias
    //             }
    //         }
    
    //         // Procesar 'cargos' y 'contrataciones' de manera similar
    //     }
    // } else {
    //     echo json_encode(["Error" => "Formato de datos incorrecto"]);    // 


// Iniciar la transaccion 
// $pdo ->beginTransaction();

// try{
//   // Insert de Empleados

// // Insert de Sueldos
//   foreach($_POST['sueldos'] as $sueldo){
//     $querySueldos = "INSERT INTO sueldos(empleados, total_remunerativo, total_no_remunerativo, tipo_aporte_adicional, monto_aporte_adicional) VALUES(?,?,?,?,?)";
//     $stmtSueldos = $pdo->prepare($querySueldos);
  
//   $stmtSueldos->bindParam('iddss',
//     $sueldo['empleados'],
//     $sueldo['total_remunerativo'],
//     $sueldo['total_no_remunerativo'],
//     $sueldo['tipo_aporte_adicional'],
//     $sueldo['monto_aporte_adicional']
//   );
//   $stmtSueldos->execute();

//   // Insert De Licencias
//   foreach($_POST['licencias'] as $licencia){
//     $queryLicencias = "INSERT INTO licencias(licencias,tipo_licencia,dias_licencia) VALUES (?,?,?)";
//     $stmtLicencias = $pdo->prepare($queryLicencias);
    
//     $stmtLicencias->bindParam('iii',
//       $licencia['licencias'],
//       $licencia['tipo_licencia'],
//       $licencia['dias_licencia']
//     );
//     $stmtLicencias->execute();
//   }
//   // Inserts de Cargos
//   foreach($_POST['cargos'] as $cargo){
//     $queryCargos = "INSERT INTO cargos(asignaciones,categoria,clase_nivel,cargo_funcion) VALUES (?,?,?,?)";
//     $stmtCargos = $pdo->prepare($queryCargos);

//     $stmtCargos->bindParam('isss',
//       $cargo['asignaciones'],
//       $cargo['categoria'],
//       $cargo['clase_nivel'],
//       $cargo['cargo_funcion']
//   );
//     $stmtCargos->execute();
//   }
//   // Inserts de contrataciones
//   foreach($_POST['contrataciones'] as $contrato){
//     $queryContrataciones = "INSERT INTO contrataciones(contrato,mes,año,dias_trabajados) VALUES (?,?,?,?)";
//     $stmtContrataciones = $pdo->prepare($queryContrataciones);
    
//     $stmtContrataciones->bindParam("iiii",
//       $contrato['contrato'],
//       $contrato['mes'],
//       $contrato['año'],
//       $contrato['dias_trabajados']
//     );
//     $stmtContrataciones->execute();
//   }
//   // Confirmar la transaccion
//     $pdo->commit();
//     echo json_encode([
//       "message"=> "_POST insertados Correctamente"
//     ]);
// }
// }catch(Exception $e){
//   // Revertir la transaccion en caso de error
//     $pdo->rollback();
//     echo json_encode([
//       "Error" => "Error al insertar los _POST". $e->getMessage()
//     ]);
//   }
