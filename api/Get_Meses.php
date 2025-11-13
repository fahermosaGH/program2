<?php
require __DIR__.'/_cors.php';

$path = __DIR__ . '/conexion2.php';
if (file_exists($path)) { require_once $path; }

if (!isset($pdo)) {
  try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=programacion2;charset=utf8mb4','root','',[
      PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES=>false,
    ]);
  } catch(Throwable $e){ http_response_code(500); echo json_encode(['error'=>'db_connect_failed','msg'=>$e->getMessage()]); exit; }
}

try {
  if (function_exists('consultaSQL')) {
    $rows = consultaSQL("Nro, Mes, CDias", "meses", "");
  } else {
    $st = $pdo->query("SELECT Nro, Mes, CDias FROM meses");
    $rows = $st->fetchAll();
  }
  echo json_encode($rows, JSON_UNESCAPED_UNICODE);
} catch(Throwable $e){ http_response_code(500); echo json_encode(['error'=>'server','msg'=>$e->getMessage()]); }

