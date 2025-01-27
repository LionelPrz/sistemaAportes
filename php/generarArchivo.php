<?php
require '../vendor/autoload.php';
require 'conexion.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\IOFactory;

// Recibir los datos del POST
$mesSeleccionado = $_POST['mes'];
$yearSeleccionado = $_POST['year'];
$nombreArchivo = "Informe_{$mesSeleccionado}_{$yearSeleccionado}.xlsx";

try {
    $query = "SELECT e.cuil AS cuil,
        SUBSTRING_INDEX(e.nombre_completo, ' ', 1) AS nombre,
        SUBSTRING_INDEX(e.nombre_completo, ' ', -1) AS apellido,
        e.tipo_contratacion AS tipo_contratacion,
        s.tipo_liquidacion AS tipo_liquidacion,
        s.total_remunerativo AS total_remunerativo,
        s.total_no_remunerativo AS total_no_remunerativo,
        s.tipo_aporte_adicional AS tipo_aporte_adicional,
        s.monto_aporte_adicional AS monto_aporte_adicional,
        s.mes AS sueldo_mes,
        s.year AS sueldo_year,
        l.tipo_licencia AS tipo_licencia,
        l.dias_licencia AS dias_licencia,
            COALESCE(l.dias_licencia, 0) AS dias_licencia,
        c.categoria AS cargo_categoria,
        c.clase_nivel AS cargo_clase,
        c.cargo_funcion AS cargo_funcion,
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
WHERE e.mes = ?
    AND e.year = ?
ORDER BY e.nombre_completo";


    // Preparar y ejecutar la consulta
    $stmt = $pdo->prepare($query);
    $stmt->execute([$mesSeleccionado, $yearSeleccionado]);

    // Verificar si hay resultados
    if ($stmt->rowCount() === 0) {
        throw new Exception("No se encontraron datos para el mes {$mesSeleccionado} y año {$yearSeleccionado}");
    }

    $spreadSheet = new Spreadsheet();
    $spreadSheet->getProperties()
        ->setCreator("Municipalidad de Mantilla")
        ->setTitle("Registro IPS");
    $hojaActiva = $spreadSheet->getActiveSheet();
    $spreadSheet->getDefaultStyle()->getFont()->setName('Calibri')->setSize(11);

    // Encabezados
    $hojaActiva->fromArray([
        "Mes",
        "Año",
        "Cuil", 
        "Nombre", 
        "Apellido", 
        "Regimen tipo de contratacion",
        "Tipo de liquidacion", 
        "Dias trabajados", 
        "Categoria o agrupacion",
        "Clase o nivel", 
        "Cargo o funcion", 
        "Total remunerativo", 
        "Total no remunerativo", 
        "Tipo de aporte adicional", 
        "Monto del aporte adicional",
        "Tipo de licencia", 
        "Dias de licencia",
    ], null, 'A1');

    $fila = 2;

    // Recorrer resultados y escribir al Excel
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $hojaActiva->fromArray([
            $row['sueldo_mes'],
            $row['sueldo_year'],
            $row['cuil'],
            $row['nombre'],
            $row['apellido'],
            $row['tipo_contratacion'],
            $row['tipo_liquidacion'],
            $row['dias_trabajados'],
            $row['cargo_categoria'],
            $row['cargo_clase'],
            $row['cargo_funcion'],
            $row['total_remunerativo'],
            $row['total_no_remunerativo'],
            $row['tipo_aporte_adicional'],
            $row['monto_aporte_adicional'], 
            $row['tipo_licencia'],
            $row['dias_licencia'],
        ], null, "A{$fila}");  
        $fila++;
    }

    // Redirigir salida al navegador
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header("Content-Disposition: attachment;filename=\"{$nombreArchivo}\"");
    header('Cache-Control: max-age=0');

    $writer = IOFactory::createWriter($spreadSheet, 'Xlsx');
    $writer->save('php://output');
    exit;

} catch (Exception $e) {
    // Manejo de errores
    echo json_encode(["error" => $e->getMessage()]);
}
?>
