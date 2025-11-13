<?php
// CORS + cookies de sesión
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD']==='OPTIONS'){ http_response_code(204); exit; }

session_name('SESS_PROG2');
session_start();

try {
  // Conexión directa (ajusta DB si tu nombre difiere)
  $pdo = new PDO(
    'mysql:host=127.0.0.1;dbname=programacion2;charset=utf8mb4',
    'root', '',
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false,
    ]
  );

  $in = json_decode(file_get_contents('php://input'), true) ?: [];
  $user = trim($in['username'] ?? '');
  $pass = (string)($in['password'] ?? '');
  if ($user==='' || $pass==='') { http_response_code(400); echo json_encode(['error'=>'faltan_datos']); exit; }

  $st = $pdo->prepare("SELECT id, username, password_hash, rol FROM usuarios WHERE username=?");
  $st->execute([$user]);
  $row = $st->fetch();

  if (!$row || !password_verify($pass, $row['password_hash'])) {
    http_response_code(401); echo json_encode(['error'=>'credenciales_invalidas']); exit;
  }

  $_SESSION['uid']  = $row['id'];
  $_SESSION['user'] = $row['username'];
  $_SESSION['rol']  = $row['rol'];

  echo json_encode(['id'=>$row['id'],'username'=>$row['username'],'rol'=>$row['rol']]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error'=>'server','msg'=>$e->getMessage()]);
}
