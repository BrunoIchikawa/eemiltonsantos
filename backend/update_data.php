<?php
$allowed_origins = ['https://eeprofmsmd.com.br', 'http://localhost:5173'];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
} else {
    header('Access-Control-Allow-Origin: https://eeprofmsmd.com.br');
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "config.php";

if (!isset($_SESSION["admin"]) || $_SESSION["admin"] !== true) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Não autorizado"]);
    exit();
}

$conn->query("CREATE TABLE IF NOT EXISTS site_data (
    section_key VARCHAR(50) PRIMARY KEY,
    data_json LONGTEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['section']) || !isset($input['data'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Campos 'section' e 'data' são obrigatórios"]);
    exit();
}

$section = $input['section'];
$data = $input['data'];

$validSections = ['general', 'home', 'team', 'projects', 'events', 'awards', 'about', 'platforms', 'faq', 'slides', 'popups'];
if (!in_array($section, $validSections)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Seção inválida"]);
    exit();
}

$jsonData = json_encode($data, JSON_UNESCAPED_UNICODE);

$stmt = $conn->prepare("INSERT INTO site_data (section_key, data_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE data_json = VALUES(data_json)");
$stmt->bind_param("ss", $section, $jsonData);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "data" => $data]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erro ao salvar: " . $stmt->error]);
}

$stmt->close();
