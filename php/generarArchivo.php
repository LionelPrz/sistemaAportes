<?php
require '../vendor/autoload.php';
require 'conexion.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Font;


// Recibir los datos del POST
$mesSeleccionado = $_POST['mes'];
$yearSeleccionado = $_POST['year'];
$nombreArchivo = "Declaracion Jurada Mes {$mesSeleccionado} Año {$yearSeleccionado}.xlsx";

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
    $spreadSheet->getDefaultStyle()->getFont()->setName('Calibri')->setSize(12);

    // Estilos Generales
    $estiloCabezera = [
        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'fff2cc']],
        'alignment'=> ['horizontal'=>Alignment::HORIZONTAL_LEFT, 'vertical'=>Alignment::VERTICAL_BOTTOM],
    ];

    $estiloTitulo = [
        'font' => ['bold'=> true, 'size'=> 14],
        'alignment'=> ['horizontal'=>Alignment::HORIZONTAL_CENTER, 'vertical'=>Alignment::VERTICAL_BOTTOM],
        'borders'=>[
                'top'=>['borderStyle'=>Border::BORDER_THIN],
                'left'=>['borderStyle'=>Border::BORDER_MEDIUM],
                'right'=>['borderStyle'=>Border::BORDER_MEDIUM],
                'bottom'=>['borderStyle'=>Border::BORDER_MEDIUM]
            ],
    ];

    $estiloBordes = [
        'borders'=>[
            'top'=>['borderStyle'=>Border::BORDER_NONE],
            'bottom'=>['borderStyle'=>Border::BORDER_DOUBLE],
            'left'=>['borderStyle'=>Border::BORDER_MEDIUM],
            'right'=>['borderStyle'=>Border::BORDER_MEDIUM],
        ],
    ];
    
    $estiloTexto = [
        'font' => ['bold'=> true, 'size'=> 14],
        'alignment'=> ['horizontal'=>Alignment::HORIZONTAL_LEFT,'vertical'=>Alignment::VERTICAL_BOTTOM],
        'borders'=>[
            'left'=>['borderStyle'=>Border::BORDER_MEDIUM],
            'right'=>['borderStyle'=>Border::BORDER_MEDIUM],
        ],
    ];
    
    // Estilizado de los bordes para simular la fusion
    $bordeSuperior = [
        'font' => ['bold'=> true, 'size'=> 12],
        'borders'=>[
            'top'=>['borderStyle'=>Border::BORDER_MEDIUM],
            'left'=>['borderStyle'=>Border::BORDER_MEDIUM],
            'right'=>['borderStyle'=>Border::BORDER_MEDIUM]
            ]
        ];
    $bordeContiguo = [
        'borders'=>[
            'left'=>['borderStyle'=>Border::BORDER_MEDIUM],
            'right'=>['borderStyle'=>Border::BORDER_MEDIUM]
        ],
    ];
    $bordeDerecha = [
        'borders'=>[
            'right'=>['borderStyle'=>Border::BORDER_MEDIUM]
            ]
        ];

    $bordeInferior = [
        'borders'=>[
            'bottom'=>['borderStyle'=>Border::BORDER_MEDIUM],
            'left'=>['borderStyle'=>Border::BORDER_MEDIUM],
            'right'=>['borderStyle'=>Border::BORDER_MEDIUM],
            ],
        ];
    
    // Estilos de el cabeza de la tabla de datos
    $bordesTablasDatos = [
        'borders'=>['allBorders'=>['borderStyle'=>Border::BORDER_THIN]],
    ];

    // Encabezados
    $encabezados = [
        'Mes','Año','Cuil','Nombre','Apellido','Regimen tipo de contratacíon','Tipo de liquidacíon',
        'Días trabajados','Categoría o agrupamiento','Clase o nivel','Cargo o función',
        'Total remunerativo','Total no remunerativo', 'Tipo de aporte adicional','Monto del aporte adicional',
        'Tipo de licencia','Días de licencia'
    ];
    
    // Inicializacion de los valores de las tablas
    $hojaActiva->getStyle('A1:Q6')->applyFromArray($estiloCabezera);
    
    // Estilo de la linea A1
    $hojaActiva->setCellValue('A1','FORMULARIO DE DECLARACIÓN JURADA DE APORTES Y CONTRATACIONES');
    $hojaActiva->getStyle('A1:Q1')->applyFromArray($estiloTitulo);
    $hojaActiva->mergeCells('A1:Q1');

    // Estilo de la linea A2
    $hojaActiva->mergeCells('A2:Q2');
    $hojaActiva->getStyle('A2:Q2')->applyFromArray($estiloBordes);
    
    // Estilo de la linea A3
    $hojaActiva->setCellValue('A3','FORMULARIO EXTENDIDO POR:');
    $hojaActiva->getStyle('A3:Q3')->applyFromArray($estiloTexto);
    
    // Estilo de la linea A4
    $hojaActiva->setCellValue('A4','De acuerdo a los antecedentes obrantes en este Organismo y a efectos de ser presentado ante el INSTITUTO DE PREVISION SOCIAL DE LA PROVINCIA DE CORRIENTES, las autoridades que suscriben DECLARA que:');
    $hojaActiva->mergeCells('A4:Q4');
    $hojaActiva->getStyle('A4:Q4')->applyFromArray($bordeContiguo);
    
    // Estilo de la linea A5
    $hojaActiva->setCellValue('A5','Tipo de Formulario:                                 Original  | rectificativa 1  | rectificativa 2');
    $hojaActiva->getStyle('A5:Q5')->applyFromArray($bordeContiguo);

    // Estilo de la linea A6
    $hojaActiva->getStyle('A6:Q6')->applyFromArray($bordeContiguo);

    //Estilo de la linea A7 a A10
    $hojaActiva->getStyle('A7:Q7')->applyFromArray($bordeSuperior);
    $hojaActiva->getStyle('A7:Q7')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    $hojaActiva->getStyle('A7:Q7')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
    $hojaActiva->getStyle('A9:Q9')->applyFromArray($bordeContiguo);
    $hojaActiva->getStyle('A10:Q10')->applyFromArray($bordeInferior);

    
    // Asignacion de tamaño de las columnas segun contenido
    foreach(range('A','Q')as $colunma){
        $hojaActiva->getColumnDimension($colunma)->setWidth(13);
        $hojaActiva->mergeCells("{$colunma}7:{$colunma}10");
        $hojaActiva->getStyle("{$colunma}7:{$colunma}10")->applyFromArray($bordeDerecha);
    }
    // Asignacion de tamaño al cabezero
    $hojaActiva->getRowDimension(1)->setRowHeight(24);
    for ($fila = 2; $fila <= 6; $fila++) {
        $hojaActiva->getRowDimension($fila)->setRowHeight(-1); // Altura automática
    }
    
    $hojaActiva->fromArray($encabezados,null,'A7');
    $fila = 11;

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
        
        // Determinar la última fila de datos
        $ultimaFila = $fila - 1; // La última fila usada en el while
        // Aplicar formato de moneda a las columnas de sueldos
        $hojaActiva->getStyle("L11:M{$ultimaFila}")->getNumberFormat()->setFormatCode('"$"#,##0.00');
        $hojaActiva->getStyle("O11:O{$ultimaFila}")->getNumberFormat()->setFormatCode('"$"#,##0.00');
        $hojaActiva->getStyle("A{$fila}:Q{$fila}")->applyFromArray($bordesTablasDatos);
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
