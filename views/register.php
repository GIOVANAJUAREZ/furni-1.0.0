<?php
// Mostrar errores (opcional)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers CORS y JSON
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// Conexión a MySQL
$host = "localhost";
$user = "root";
$password = ""; // tu contraseña si existe
$dbname = "tienda";
$port = 3308;

$conn = new mysqli($host, $user, $password, $dbname, $port);
if ($conn->connect_error) {
    echo json_encode(['status'=>'error','error'=>'No se puede establecer una conexión: '.$conn->connect_error]);
    exit;
}

// Leer JSON
$data = json_decode(file_get_contents('php://input'), true);
if(!isset($data['name'],$data['email'],$data['password'])){
    echo json_encode(['status'=>'error','error'=>'Datos incompletos']);
    exit;
}

$name = $conn->real_escape_string($data['name']);
$email = $conn->real_escape_string($data['email']);
$password = password_hash($data['password'], PASSWORD_DEFAULT);

// Verificar si el email ya existe
$result = $conn->query("SELECT id FROM users WHERE email='$email'");
if($result && $result->num_rows > 0){
    echo json_encode(['status'=>'error','error'=>'El correo ya está registrado']);
    exit;
}

// Insertar usuario
$sql = "INSERT INTO users (name,email,password) VALUES ('$name','$email','$password')";
if($conn->query($sql)){
    echo json_encode(['status'=>'success','message'=>'Usuario registrado correctamente']);
} else {
    echo json_encode(['status'=>'error','error'=>'Error al registrar usuario: '.$conn->error]);
}

$conn->close();
?>
