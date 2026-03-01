<?php
// ===== CORS =====
$allowed_origins = ['https://eeprofmsmd.com.br', 'http://localhost:5173'];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
} else {
    header('Access-Control-Allow-Origin: https://eeprofmsmd.com.br');
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["password"])) {
    echo json_encode(["success" => false, "message" => "Senha não informada"]);
    exit();
}

$password = $data["password"];

$stmt = $conn->prepare("SELECT password_hash FROM admin_config LIMIT 1");
$stmt->execute();
$stmt->bind_result($hash);
$stmt->fetch();
$stmt->close();

if ($hash && password_verify($password, $hash)) {
    session_regenerate_id(true);
    $_SESSION["admin"] = true;
    echo json_encode(["success" => true]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Senha incorreta"]);
}

$conn->close();
