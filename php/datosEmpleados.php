<?php
include_once 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

try {
    if (!isset($_POST['cuil'], $_POST['mes'], $_POST['year'])) {
        throw new Exception('Datos incompletos proporcionados.');
    }

    $cuil = $_POST['cuil'];
    $mes = $_POST['mes'];
    $year = $_POST['year'];

    $query = "SELECT e.cuil AS Cuil,
        SUBSTRING_INDEX(e.nombre_completo, ' ', 1) AS Nombre,
        SUBSTRING_INDEX(e.nombre_completo, ' ', -1) AS Apellido,
    s.tipo_liquidacion AS Tipo_liquidacion,
    s.total_remunerativo AS Total_remunerativo,
    s.total_no_remunerativo AS Total_no_remunerativo,
    s.tipo_aporte_adicional AS Tipo_aporte_adicional,
    s.monto_aporte_adicional AS Monto_aporte_adicional,
    s.mes AS Mes,
    s.year AS Year,
    l.tipo_licencia AS tipo_licencia,
    l.dias_licencia AS dias_licencia,
    c.categoria AS categoria,
    c.clase_nivel AS clase,
    c.cargo_funcion AS funcion,
    ctr.mes AS contrato_mes,
    ctr.year AS contrato_year,
    ctr.dias_trabajados AS dias_trabajados
FROM empleados e
LEFT JOIN sueldos s 
    ON e.cuil = s.empleados 
    AND e.mes = s.mes 
    AND e.year = s.year
LEFT JOIN licencias l 
    ON e.cuil = l.licencias 
    AND e.mes = l.mes 
    AND e.year = l.year
LEFT JOIN cargos c 
    ON e.cuil = c.asignaciones 
    AND e.mes = c.mes 
    AND e.year = c.year
LEFT JOIN contrataciones ctr 
    ON e.cuil = ctr.contrato 
    AND e.mes = ctr.mes 
    AND e.year = ctr.year
WHERE e.cuil = ? AND e.mes = ? AND e.year = ?
ORDER BY e.nombre_completo";

    $stmt = $pdo->prepare($query);
    $stmt->execute([$cuil, $mes, $year]);
    $empleadoData = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($empleadoData) {
        echo json_encode($empleadoData);
    } else {
        echo json_encode(['error' => 'No se encontraron datos para el CUIL especificado.']);
    }
} catch (Exception $e) {
    echo json_encode(["Error" => $e->getMessage()]);
}
