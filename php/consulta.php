<?php
    include 'conexion.php';

    $datos = json_decode(file_get_contents('php://input'), true);

    // Incluir conexión a la base de datos
    include 'conexion.php';
    
    try {
        // Consulta para obtener todos los cuils, meses y años
        $query = "SELECT e.cuil, c2.mes, c2.year FROM empleados e JOIN contrataciones c2 ON e.cuil = c2.contrato";
        
        // Preparar y ejecutar la consulta
        $stmt = $pdo->prepare($query);
        $stmt->execute();
        
        // Obtener los resultados
        $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        if ($resultados) {
            echo json_encode($resultados); // Retornar los resultados como JSON
        } else {
            echo json_encode(["Mensaje" => "No se encontraron datos."]);
        }
    } catch (Exception $e) {
        echo json_encode(["Error" => $e->getMessage()]);
    }
?>