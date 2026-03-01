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

$sql = "SELECT
            ga.id,
            ga.name as title,
            ga.description as category,
            ga.created_at as date,
            m1.file_path as cover_path
        FROM gallery_albums ga
        LEFT JOIN media m1 ON ga.cover_image_id = m1.id
        ORDER BY ga.created_at DESC";

$result = $conn->query($sql);
$albums = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $albumId = $row['id'];

        $album = [
            "id" => $albumId,
            "title" => $row["title"],
            "date" => date("d/m/Y", strtotime($row["date"])),
            "coverImage" => $row["cover_path"] ? "https://eeprofmsmd.com.br/backend" . $row["cover_path"] : "",
            "category" => $row["category"] ?? "Geral",
            "active" => true,
            "images" => []
        ];

        $sqlItems = "SELECT m.file_path
                     FROM gallery_items gi
                     JOIN media m ON gi.media_id = m.id
                     WHERE gi.album_id = '$albumId'";
        $resItems = $conn->query($sqlItems);

        if ($resItems && $resItems->num_rows > 0) {
            while ($itemRow = $resItems->fetch_assoc()) {
                $album["images"][] = "https://eeprofmsmd.com.br/backend" . $itemRow["file_path"];
            }
        }

        $albums[] = $album;
    }
}

echo json_encode(["success" => true, "gallery" => $albums]);
