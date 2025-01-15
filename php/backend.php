<?php
// se que esta mal pero no me dejan opcion alguna
error_reporting(E_ALL ^ E_WARNING);

// Incluir conexión a la base de datos
include 'conexion.php';
$datos = json_decode(file_get_contents('php://input'), true);
$nombre = $datos['nombre'];
$apellido = $datos['apellido'];
$respuesta = json_encode($nombre);
$exito = 'Insercion Exitosa Master';

$sql = "INSERT INTO prueba(prueba_id,nombre)
    VALUES ('0','$apellido')";

if($pdo->query($sql)=== TRUE){
  echo json_encode($exito);
}else{
  echo json_encode("Error");
}
?>