<?php
// api/Update_Ventas.php
require __DIR__.'/_cors.php';

// Solo admin
if (($_SESSION['rol'] ?? '') !== 'admin') {
  http_response_code(403); echo json_encode(['error'=>'forbidden']); exit;
}

$in  = json_decode(file_get_contents('php://input'), true) ?: [];
$nro = isset($in['nro']) ? (int)$in['nro'] : null;   // 1..12
$s1  = (int)($in['Suc1'] ?? 0);
$s2  = (int)($in['Suc2'] ?? 0);
$s3  = (int)($in['Suc3'] ?? 0);
$s4  = (int)($in['Suc4'] ?? 0);
$s5  = (int)($in['Suc5'] ?? 0);

if (!$nro) { http_response_code(400); echo json_encode(['error'=>'sin_identificador']); exit; }

// Conexión
$path = __DIR__ . '/conexion2.php';
if (file_exists($path)) { require_once $path; }
if (!isset($pdo)) {
  $pdo = new PDO(
    'mysql:host=127.0.0.1;dbname=programacion2;charset=utf8mb4',
    'root','',
    [
      PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES=>false,
    ]
  );
}

// Helpers SIN placeholders “?” para columnas
function tieneCol(PDO $pdo, string $tabla, string $col): bool {
  $tabla = str_replace('`','',$tabla);
  $col   = str_replace('`','',$col);
  $sql = "SELECT COUNT(*) FROM information_schema.COLUMNS
          WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = '$tabla'
            AND COLUMN_NAME = '$col'";
  return (int)$pdo->query($sql)->fetchColumn() > 0;
}

try {
  // Caso 1: columna Nro (ideal)
  if (tieneCol($pdo,'venta','Nro')) {
    $st = $pdo->prepare("UPDATE venta SET Suc1=?, Suc2=?, Suc3=?, Suc4=?, Suc5=? WHERE Nro=?");
    $st->execute([$s1,$s2,$s3,$s4,$s5,$nro]);
    echo json_encode(['ok'=>true]); exit;
  }

  // Caso 2: columna id (buscamos el id de la fila nro en orden ascendente)
  if (tieneCol($pdo,'venta','id')) {
    $offset = max(0,$nro-1);
    // sin placeholders en LIMIT/OFFSET
    $id = $pdo->query("SELECT id FROM venta ORDER BY id ASC LIMIT 1 OFFSET $offset")->fetchColumn();
    if (!$id) { http_response_code(400); echo json_encode(['error'=>'fila_inexistente']); exit; }
    $st = $pdo->prepare("UPDATE venta SET Suc1=?, Suc2=?, Suc3=?, Suc4=?, Suc5=? WHERE id=?");
    $st->execute([$s1,$s2,$s3,$s4,$s5,$id]);
    echo json_encode(['ok'=>true]); exit;
  }

  // Sin Nro ni id -> no sabemos qué fila actualizar
  http_response_code(500);
  echo json_encode([
    'error'=>'schema_sin_pk_o_nro',
    'msg'=>'Agregá columna Nro (1..12) o id AUTO_INCREMENT en venta'
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error'=>'server','msg'=>$e->getMessage()]);
}
