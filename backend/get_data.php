<?php
$allowed_origins = ['https://eeprofmsmd.com.br', 'http://localhost:5173'];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
} else {
    header('Access-Control-Allow-Origin: https://eeprofmsmd.com.br');
}
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "config.php";

// Criar tabela se não existir
$conn->query("CREATE TABLE IF NOT EXISTS site_data (
    section_key VARCHAR(50) PRIMARY KEY,
    data_json LONGTEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

$section = isset($_GET['section']) ? $conn->real_escape_string($_GET['section']) : '';

if (empty($section)) {
    echo json_encode(["success" => false, "message" => "Seção não informada"]);
    exit();
}

$validSections = ['general', 'home', 'team', 'projects', 'events', 'awards', 'about', 'platforms', 'faq', 'slides', 'popups'];
if (!in_array($section, $validSections)) {
    echo json_encode(["success" => false, "message" => "Seção inválida"]);
    exit();
}

$stmt = $conn->prepare("SELECT data_json FROM site_data WHERE section_key = ?");
$stmt->bind_param("s", $section);
$stmt->execute();
$stmt->bind_result($json);
$found = $stmt->fetch();
$stmt->close();

if ($found && $json) {
    echo json_encode(["success" => true, "data" => json_decode($json, true)]);
} else {
    echo json_encode(["success" => true, "data" => null]);
}
