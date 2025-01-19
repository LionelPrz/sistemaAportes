<?php
$host = 'localhost';
$port = '3306'; // Puerto encontrado
$dbname = 'datos_empleados';
$username = 'root';
$password = '';

try {
    // Crear la conexión PDO
    $pdo = new PDO("mysql:host=$host; port=$port; dbname=$dbname; charset=utf8mb4", $username, $password);
    // Configurar modo de error
    $pdo-> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Conexion Exitosa master !";
} catch (PDOException $e) {
    // Manejo de errores
    die("Error en la conexión: " . $e-> getMessage());
}
?>