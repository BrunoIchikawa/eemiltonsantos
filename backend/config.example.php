<?php
// Configuração de conexão com o banco de dados
// COPIE este arquivo para config.php e preencha com suas credenciais

// Em produção, não exiba erros na tela para evitar Information Disclosure
error_reporting(0);
ini_set('display_errors', 0);

if (session_status() === PHP_SESSION_NONE) {
    // Blindando a sessão contra roubo (XSS e CSRF)
    session_set_cookie_params([
        'lifetime' => 86400,
        'path' => '/',
        'domain' => $_SERVER['HTTP_HOST'],
        'secure' => isset($_SERVER['HTTPS']), // Apenas HTTPS se disponível
        'httponly' => true, // Impede JS de ler o cookie
        'samesite' => 'Strict' // Impede requisições de outros sites
    ]);
    session_start();
}

// Global Security Headers (OWASP)
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("Strict-Transport-Security: max-age=31536000; includeSubDomains");

$host = 'localhost';
$db   = 'SEU_BANCO_AQUI';
$user = 'SEU_USUARIO_AQUI';
$pass = 'SUA_SENHA_AQUI';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Erro de conexão: " . $conn->connect_error]);
    exit();
}

$conn->set_charset("utf8mb4");
