<?php
// Incluir la conexión a la base de datos
include 'conexion.php';

// Recibir los datos desde el frontend (pueden ser enviados mediante POST o GET)
$cuilFiltrado = $_POST['cuil'];  // o lo que estés usando para el cuil
$mesFiltrado = $_POST['mes'];    // mes
$yearFiltrado = $_POST['year'];  // año

try {
    // Consulta SQL más específica
    $query = "SELECT e.cuil,
    SUBSTRING_INDEX(e.nombre_completo, ' ', 1) AS nombre,
    SUBSTRING_INDEX(e.nombre_completo, ' ', -1) AS apellido,
    e.tipo_contratacion,
    s.total_remunerativo,
    s.total_no_remunerativo,
    s.tipo_aporte_adicional,
    s.monto_aporte_adicional,
    l.tipo_licencia,
    l.dias_licencia,
    c.categoria,
    c.clase_nivel,
    c.cargo_funcion,
    c2.mes,
    c2.año,
    c2.dias_trabajados
FROM 
    empleados e
JOIN sueldos s ON e.cuil = s.empleados
JOIN licencias l ON e.cuil = l.licencias
JOIN cargos c ON e.cuil = c.asignaciones
JOIN contrataciones c2 ON e.cuil = c2.contrato
WHERE 
    e.cuil = ? AND t.mes = ? AND t.año = ?";

    // Preparar y ejecutar la consulta
    $stmt = $pdo->prepare($query);
    $stmt->execute([$cuilFiltrado, $mesFiltrado, $yearFiltrado]);

    // Obtener el resultado
    $empleadoData = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verificar si se encontró el empleado
    if ($empleadoData) {
        // Devolver los datos en formato JSON
        echo json_encode($empleadoData);
    } else {
        // En caso de no encontrar datos
        echo json_encode(["error" => "Datos no encontrados"]);
    }
} catch (Exception $e) {
    // Manejo de errores
    echo json_encode(["error" => $e->getMessage()]);
}
?>