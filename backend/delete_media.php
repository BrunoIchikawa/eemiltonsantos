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

$data = json_decode(file_get_contents("php://input"));
if (!isset($data->id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID não fornecido"]);
    exit();
}

$id = $conn->real_escape_string($data->id);

$sql = "SELECT file_path FROM media WHERE id = '$id'";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $filePath = __DIR__ . $row['file_path'];

    $deleteSql = "DELETE FROM media WHERE id = '$id'";
    if ($conn->query($deleteSql) === TRUE) {
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        echo json_encode(["success" => true, "message" => "Mídia deletada"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erro ao deletar do banco."]);
    }
} else {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Mídia não encontrada"]);
}
