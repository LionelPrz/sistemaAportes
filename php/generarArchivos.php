 <?php 
    include 'conexion.php';
    $input = json_decode(file_get_contents('php://input'),true);
    // Consulta para obtener los años disponibles
    try{
    if(!isset($input['tipo'])){
        echo json_encode(['Error:'=> 'El campo "tipo" es obligatorio']);
        exit;
    }
    $tipo = $input['tipo'];
    // Obtener los años disponibles
    if($tipo=== 'year'){
        $years = [];
        $consulta = "SELECT DISTINCT year FROM empleados";
        $stmt = $pdo->query($consulta);
        $years = $stmt->fetchAll(PDO::FETCH_COLUMN);
            header('Content-Type:application/json');
            echo json_encode($years);
    }
    if($tipo === 'mes'){
        if(!isset($input['year'])){
            echo json_encode(['Error'=> 'El campo "Año" es obligatorio']);
        }
        $yearSeleccionado = $input['year'];
        $consulta2 = "SELECT DISTINCT mes FROM empleados WHERE year = ? ORDER BY mes";
        $stmt = $pdo->prepare($consulta2);
        $stmt->bindParam("i",$yearSeleccionado);
        $stmt -> execute();
        $resultado = $stmt->fetchAll(PDO::FETCH_COLUMN);
            header('Content-Type:application/json');
            echo json_encode($resultado);
    }
    }catch(PDOException $e){
        echo json_encode(['Error' => $e->getMessage()]);
    }
?>