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

$sql = "SELECT * FROM media ORDER BY uploaded_at DESC";
$result = $conn->query($sql);

$mediaList = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $mediaList[] = [
            "id" => $row["id"],
            "name" => $row["file_name"],
            "url" => "https://eeprofmsmd.com.br/backend" . $row["file_path"],
            "type" => $row["file_type"],
            "date" => date("d/m/Y", strtotime($row["uploaded_at"])),
        ];
    }
}

echo json_encode(["success" => true, "media" => $mediaList]);
