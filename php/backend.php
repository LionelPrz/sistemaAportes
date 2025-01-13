<?php
// Configuración para permitir solicitudes desde cualquier origen (CORS).
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Verificar el método de la solicitud.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Método no permitido.
    echo json_encode(['error' => 'Método no permitido. Solo se acepta POST.']);
    exit;
}

// Leer los datos enviados desde el cuerpo de la solicitud.
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validar si los datos llegaron correctamente.
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400); // Solicitud incorrecta.
    echo json_encode(['error' => 'Datos JSON inválidos.']);
    exit;
}

// Validar que el JSON sea un arreglo (puede contener múltiples filas de datos).
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Se esperaba un arreglo de datos.']);
    exit;
}

// Preparar respuesta.
$procesados = [];
foreach ($data as $index => $fila) {
    // Validar que cada fila sea un arreglo asociativo con las claves necesarias.
    if (!is_array($fila)) {
        $procesados[] = [
            'fila' => $index,
            'status' => 'error',
            'mensaje' => 'La fila no tiene el formato esperado.'
        ];
        continue;
    }

    // Validar que todas las columnas requeridas estén presentes (personaliza según tu esquema).
    $camposRequeridos = ['campo1', 'campo2', 'campo3', /* ... otros campos ... */];
    $faltantes = array_diff($camposRequeridos, array_keys($fila));

    if (!empty($faltantes)) {
        $procesados[] = [
            'fila' => $index,
            'status' => 'error',
            'mensaje' => 'Faltan campos obligatorios: ' . implode(', ', $faltantes)
        ];
        continue;
    }

    // Limpiar los datos (por ejemplo, evitar inyecciones XSS).
    $datosLimpios = array_map('htmlspecialchars', $fila);

    // Agregar la fila procesada (aquí puedes preparar para la base de datos).
    $procesados[] = [
        'fila' => $index,
        'status' => 'ok',
        'datos' => $datosLimpios
    ];
}

// Responder con el estado del procesamiento.
http_response_code(200);
echo json_encode([
    'message' => 'Procesamiento completado.',
    'resultados' => $procesados
]);
?>
