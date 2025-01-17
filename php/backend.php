<?php
// se que esta mal pero no me dejan opcion alguna
// error_reporting(E_ALL ^ E_WARNING);

// Incluir conexión a la base de datos
include 'conexion.php';
$datos = json_decode(file_get_contents('php://input'), true);

// Iniciar la transaccion 
$pdo ->beginTransaction();

try{
  // Insert de Empleados
  $empleado = $datos['empleados'];
    $queryEmpleado = "INSERT INTO empleados(cuil,nombre_completo,regimenes) VALUES (?,?,?)";
    $stmtEmpleado = $pdo->prepare($queryEmpleado);

  $stmtEmpleado->bindParam("bsi",
  $empleado['cuil'],
  $empleado['nombre_completo'],
  $empleado['tipo_contratacion']);
  $stmtEmpleado->execute();

// Insert de Sueldos
  foreach($datos['sueldos'] as $sueldo){
    $querySueldos = "INSERT INTO sueldos(empleados, total_remunerativo, total_no_remunerativo, tipo_aporte_adicional, monto_aporte_adicional) VALUES(?,?,?,?,?)";
    $stmtSueldos = $pdo->prepare($querySueldos);
  
  $stmtSueldos->bindParam('iddss',
    $sueldo['empleados'],
    $sueldo['total_remunerativo'],
    $sueldo['total_no_remunerativo'],
    $sueldo['tipo_aporte_adicional'],
    $sueldo['monto_aporte_adicional']
  );
  $stmtSueldos->execute();

  // Insert De Licencias
  foreach($datos['licencias'] as $licencia){
    $queryLicencias = "INSERT INTO licencias(licencias,tipo_licencia,dias_licencia) VALUES (?,?,?)";
    $stmtLicencias = $pdo->prepare($queryLicencias);
    
    $stmtLicencias->bindParam('iii',
      $licencia['licencias'],
      $licencia['tipo_licencia'],
      $licencia['dias_licencia']
    );
    $stmtLicencias->execute();
  }
  // Inserts de Cargos
  foreach($datos['cargos'] as $cargo){
    $queryCargos = "INSERT INTO cargos(asignaciones,categoria,clase_nivel,cargo_funcion) VALUES (?,?,?,?)";
    $stmtCargos = $pdo->prepare($queryCargos);

    $stmtCargos->bindParam('isss',
      $cargo['asignaciones'],
      $cargo['categoria'],
      $cargo['clase_nivel'],
      $cargo['cargo_funcion']
  );
    $stmtCargos->execute();
  }
  // Inserts de contrataciones
  foreach($datos['contrataciones'] as $contrato){
    $queryContrataciones = "INSERT INTO contrataciones(contrato,mes,año,dias_trabajados) VALUES (?,?,?,?)";
    $stmtContrataciones = $pdo->prepare($queryContrataciones);
    
    $stmtContrataciones->bindParam("iiii",
      $contrato['contrato'],
      $contrato['mes'],
      $contrato['año'],
      $contrato['dias_trabajados']
    );
    $stmtContrataciones->execute();
  }
  // Confirmar la transaccion
    $pdo->commit();
    echo json_encode([
      "message"=> "Datos insertados Correctamente"
    ]);
}
}catch(Exception $e){
  // Revertir la transaccion en caso de error
    $pdo->rollback();
    echo json_encode([
      "Error" => "Error al insertar los datos". $e->getMessage()
    ]);
  }
?>
