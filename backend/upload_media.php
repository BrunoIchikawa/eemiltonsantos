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

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Nenhum arquivo recebido ou o arquivo é muito grande para o servidor."]);
    exit();
}

if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Erro no upload do PHP (Código: " . $_FILES['file']['error'] . ")"]);
    exit();
}

$file = $_FILES['file'];
$uploadDir = __DIR__ . '/uploads/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$fileNameOriginal = basename($file["name"]);
$fileExtension = strtolower(pathinfo($fileNameOriginal, PATHINFO_EXTENSION));
$allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm'];

if (!in_array($fileExtension, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Extensão de arquivo não permitida"]);
    exit();
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file["tmp_name"]);
finfo_close($finfo);

$allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm'
];

if (!in_array($mime, $allowedMimeTypes)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Alerta de Segurança: Assinatura do arquivo inváĺida ou maliciosa (MIME mismatch). Acesso negado."]);
    exit();
}

$newFileName = uniqid('media_') . '.' . $fileExtension;
$targetFilePath = $uploadDir . $newFileName;

if (move_uploaded_file($file["tmp_name"], $targetFilePath)) {
    $relativePath = "/uploads/" . $newFileName;
    $fileType = in_array($fileExtension, ['mp4', 'webm']) ? 'video' : 'image';
    $originalName = $conn->real_escape_string($fileNameOriginal);

    $sql = "INSERT INTO media (file_name, file_path, file_type) VALUES ('$originalName', '$relativePath', '$fileType')";

    if ($conn->query($sql) === TRUE) {
        $lastId = $conn->insert_id;
        echo json_encode([
            "success" => true,
            "media" => [
                "id" => $lastId,
                "url" => "https://eeprofmsmd.com.br/backend" . $relativePath,
                "name" => $fileNameOriginal,
                "type" => $fileType,
                "date" => date("d/m/Y"),
                "size" => number_format($file['size'] / 1024, 2) . " KB"
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erro ao registrar no banco de dados: " . $conn->error]);
    }
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erro ao mover arquivo para pasta de destino."]);
}
