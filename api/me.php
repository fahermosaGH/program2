<?php
require __DIR__.'/_cors.php';
echo json_encode([
  'auth' => isset($_SESSION['uid']),
  'id'   => $_SESSION['uid']  ?? null,
  'username' => $_SESSION['user'] ?? null,
  'rol'  => $_SESSION['rol']  ?? null
]);
