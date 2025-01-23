<?php 
include 'conexion.php';
$input = json_decode(file_get_contents('php://input'), true);

// Validación inicial
if (!isset($input['tipo'])) {
    header('Content-Type: application/json');
    echo json_encode(['Error' => 'El campo "tipo" es obligatorio']);
    exit;
}

$tipo = $input['tipo'];

try {
    if ($tipo === 'year') {
        $consulta = "SELECT DISTINCT year FROM empleados";
        $stmt = $pdo->query($consulta);
        $years = $stmt->fetchAll(PDO::FETCH_COLUMN);

        header('Content-Type: application/json');
        echo json_encode($years);
    }

    if ($tipo === 'mes') {
        if (!isset($input['year'])) {
            header('Content-Type: application/json');
            echo json_encode(['Error' => 'El campo "year" es obligatorio']);
            exit;
        }

        $yearSeleccionado = $input['year'];
        $consulta2 = "SELECT DISTINCT mes FROM empleados WHERE year = ? ORDER BY mes";
        $stmt = $pdo->prepare($consulta2);
        $stmt->bindParam(1, $yearSeleccionado, PDO::PARAM_INT);
        $stmt->execute();
        $resultado = $stmt->fetchAll(PDO::FETCH_COLUMN);

        header('Content-Type: application/json');
        echo json_encode($resultado);
    }
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['Error' => $e->getMessage()]);
}
?>