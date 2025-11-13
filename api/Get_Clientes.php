<?php
// api/Get_Clientes.php
require __DIR__.'/_cors.php';

// 1) Intentar incluir tu conexión (por si define consultaSQL o $pdo)
$incluida = false;
$path = __DIR__ . '/conexion2.php';
if (file_exists($path)) {
  $incluida = (bool) require_once $path;
}

if (!isset($pdo)) {
  try {
    $pdo = new PDO(
      'mysql:host=127.0.0.1;dbname=programacion2;charset=utf8mb4',
      'root', '',
      [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
      ]
    );
  } catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error'=>'db_connect_failed','msg'=>$e->getMessage()]);
    exit;
  }
}

try {
  // 3) Usar tu helper si existe; si no, hacer la query directo
  if (function_exists('consultaSQL')) {
    $rows = consultaSQL("Apellido, Nombre, Saldo, Status", "clientes", "");
  } else {
    $st = $pdo->query("SELECT Apellido, Nombre, Saldo, Status FROM clientes");
    $rows = $st->fetchAll();
  }
  echo json_encode($rows, JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error'=>'server','msg'=>$e->getMessage()]);
}
