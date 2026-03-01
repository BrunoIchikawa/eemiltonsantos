<?php
// Configuração de conexão com o banco de dados
// COPIE este arquivo para config.php e preencha com suas credenciais

error_reporting(E_ALL);
ini_set('display_errors', 1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

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
