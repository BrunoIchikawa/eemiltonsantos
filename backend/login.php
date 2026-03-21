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

// Implementação de Rate Limiting (Anti Brute-Force da Rodada 4)
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
    $_SESSION['last_attempt_time'] = time();
}

// Bloqueio de 5 minutos se errar 5 vezes
if ($_SESSION['login_attempts'] >= 5) {
    if (time() - $_SESSION['last_attempt_time'] < 300) {
        http_response_code(429); // Too Many Requests
        echo json_encode(["success" => false, "message" => "Muitas tentativas falhas. Conta bloqueada por 5 minutos por segurança."]);
        exit();
    } else {
        // Reset após os 5 minutos de punição
        $_SESSION['login_attempts'] = 0;
    }
}

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
    session_regenerate_id(true); // Previne Session Fixation Attack
    $_SESSION["admin"] = true;
    $_SESSION['login_attempts'] = 0; // Reseta as tentativas no sucesso
    echo json_encode(["success" => true]);
} else {
    // Incrementa erros e atualiza tempo
    $_SESSION['login_attempts']++;
    $_SESSION['last_attempt_time'] = time();
    
    // Timing attack defense (delay 1s-2s)
    usleep(rand(1000000, 2000000));
    
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Senha incorreta"]);
}

$conn->close();
