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

    $query = "SELECT e.cuil AS cuil,
    SUBSTRING_INDEX(e.nombre_completo, ' ', 1) AS nombre,
    SUBSTRING_INDEX(e.nombre_completo, ' ', -1) AS apellido,
    e.tipo_contratacion AS tipo_contratacion,
    s.tipo_liquidacion AS tipo_liquidacion,
    s.total_remunerativo AS total_remunerativo,
    s.total_no_remunerativo AS total_no_remunerativo,
    s.tipo_aporte_adicional AS tipo_aporte_adicional,
    s.monto_aporte_adicional AS monto_aporte_adicional,
    CASE 
        WHEN s.mes IN(6.5,12.5) THEN s.mes
        ELSE CAST(s.mes AS UNSIGNED)
    END AS sueldo_mes,
    s.year AS sueldo_year,
    l.tipo_licencia AS tipo_licencia,
    l.dias_licencia AS dias_licencia,
        COALESCE(l.dias_licencia, 0) AS dias_licencia,
    c.categoria AS cargo_categoria,
    c.clase_nivel AS cargo_clase,
    c.cargo_funcion AS cargo_funcion,
    CASE
        WHEN ctr.mes IN (6.5,12.5) THEN ctr.mes
        ELSE CAST(ctr.mes AS UNSIGNED)
    END AS contrato_mes,
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
