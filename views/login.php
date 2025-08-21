<?php
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
$password = "";
$dbname = "tienda";
$port = 3308;

$conn = new mysqli($host, $user, $password, $dbname, $port);
if ($conn->connect_error) {
    echo json_encode(['status'=>'error','error'=>'No se puede establecer una conexión: '.$conn->connect_error]);
    exit;
}

// Leer JSON
$data = json_decode(file_get_contents('php://input'), true);
if(!isset($data['email'],$data['password'])){
    echo json_encode(['status'=>'error','error'=>'Datos incompletos']);
    exit;
}

$email = $conn->real_escape_string($data['email']);
$password = $data['password'];

// Buscar usuario
$result = $conn->query("SELECT * FROM users WHERE email='$email'");
if($result && $result->num_rows > 0){
    $user = $result->fetch_assoc();
    if(password_verify($password, $user['password'])){
        echo json_encode([
            'status'=>'success',
            'user'=>[
                'id'=>$user['id'],
                'name'=>$user['name'],
                'email'=>$user['email'],
                'created_at'=>$user['created_at']
            ]
        ]);
    } else echo json_encode(['status'=>'error','error'=>'Contraseña incorrecta']);
} else echo json_encode(['status'=>'error','error'=>'Usuario no encontrado']);

$conn->close();
?>
