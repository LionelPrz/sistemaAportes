<?php
// se que esta mal pero no me dejan opcion alguna
// error_reporting(E_ALL ^ E_WARNING);

// Incluir conexión a la base de datos
// include 'conexion.php';
$datos = json_decode(file_get_contents('php://input'), true);

if($datos){
  echo json_encode([
    'message' => "datos recibidos",
    'receivedData'=> $datos
  ]);
}else{
  echo json_encode([
    'message' => "No se pudo enviar los datos o estos son invalidos"
  ]);
}
?>