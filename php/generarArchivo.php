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
    $query = "SELECT e.cuil,
        SUBSTRING_INDEX(e.nombre_completo, ' ', 1) AS nombre,
        SUBSTRING_INDEX(e.nombre_completo, ' ', -1) AS apellido,
        e.tipo_contratacion,
        s.total_remunerativo,
        s.total_no_remunerativo,
        s.tipo_aporte_adicional,
        s.monto_aporte_adicional,
        s.tipo_liquidacion,
        l.tipo_licencia,
        l.dias_licencia,
        c.categoria,
        c.clase_nivel,
        c.cargo_funcion,
        c2.mes,
        c2.year,
        c2.dias_trabajados
    FROM empleados e
    JOIN sueldos s ON e.cuil = s.empleados
    JOIN licencias l ON e.cuil = l.licencias
    JOIN cargos c ON e.cuil = c.asignaciones
    JOIN contrataciones c2 ON e.cuil = c2.contrato
    WHERE c2.mes = ? AND c2.year = ?";

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
        "Mes", "Año", "Cuil", "Nombre", "Apellido", "Regimen tipo de contratacion",
        "Tipo de liquidacion", "Dias trabajados", "Categoria o agrupacion",
        "Clase o nivel", "Cargo o funcion", "Total remunerativo", 
        "Total no remunerativo", "Tipo de aporte adicional", "Monto del aporte adicional",
        "Tipo de licencia", "Dias de licencia"
    ], null, 'A1');

    $fila = 2;

    // Recorrer resultados y escribir al Excel
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $hojaActiva->fromArray(array_values($row), null, "A{$fila}");
        $fila++;
    }

/* Here there will be some code where you create $spreadsheet */

// redirect output to client browser
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="myfile.xlsx"');
header('Cache-Control: max-age=0');

$writer = IOFactory::createWriter($spreadSheet, 'Xlsx');
$writer->save('php://output');

} catch (Exception $e) {
    // Manejo de errores
    echo json_encode(["error" => $e->getMessage()]);
}
?>