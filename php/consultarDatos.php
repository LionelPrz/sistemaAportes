<?php
include_once 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $datos = json_decode(file_get_contents('php://input'), true);
    if (!isset($datos['cuil'])) {
        throw new Exception('CUIL no proporcionado.');
    }

    $query = "SELECT e.cuil, c2.mes, c2.year FROM empleados e JOIN contrataciones c2 ON e.cuil = c2.contrato";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($resultados) {
        echo json_encode($resultados);
    } else {
        echo json_encode(["Mensaje" => "No se encontraron datos."]);
    }
} catch (Exception $e) {
    echo json_encode(["Error" => $e->getMessage()]);
}

?>