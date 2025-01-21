<?php 
    include 'conexion.php';

    // Consulta para obtener los años disponibles
    try{
    $years = [];
    $consulta = "SELECT DISTINCT year AS año FROM contrataciones ORDER BY year";
    $stmt = $pdo->query($consulta);
        $stmt->fetchAll(PDO::FETCH_COLUMN);

        header('Content-Type:application/json');
        echo json_encode($years);

    }catch(PDOException $e){
        echo json_encode(['Error' => $e->getMessage()]);
    }
?>