<?php
header('Content-Type: application/json');
require __DIR__.'/conexion2.php';
$estado = ['tiene_pdo'=>isset($pdo), 'tiene_conn'=>isset($conn), 'tiene_conexion'=>isset($conexion)];
$out = ['conexion'=>$estado, 'pasos'=>[]];

try {
  if (isset($pdo)) {
    $out['pasos'][] = 'usando PDO';
    $ok = $pdo->query('SELECT 1')->fetchColumn();
  } elseif (isset($conn)) {
    $out['pasos'][] = 'usando mysqli $conn';
    $ok = $conn->query('SELECT 1')->fetch_row()[0] ?? null;
  } elseif (isset($conexion)) {
    $out['pasos'][] = 'usando mysqli $conexion';
    $ok = $conexion->query('SELECT 1')->fetch_row()[0] ?? null;
  } else {
    throw new Exception('sin_conexion_variables');
  }
  $out['select1'] = $ok;

  // ¿existe la tabla usuarios?
  if (isset($pdo)) {
    $st = $pdo->query("SHOW TABLES LIKE 'usuarios'");
    $out['tabla_usuarios'] = $st->rowCount() ? 'existe' : 'no_existe';
  } else {
    $db = isset($conn) ? $conn : $conexion;
    $st = $db->query("SHOW TABLES LIKE 'usuarios'");
    $out['tabla_usuarios'] = ($st && $st->num_rows>0) ? 'existe' : 'no_existe';
  }
  echo json_encode($out);
} catch (Throwable $e) {
  http_response_code(500);
  $out['error'] = $e->getMessage();
  echo json_encode($out);
}
