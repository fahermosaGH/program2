<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/conexion2.php';

$rows = consultaSQL("Id_Suc, Nombre_Suc, Dir_Suc, Cant_Emp_Suc", "sucursales", "");
echo json_encode($rows, JSON_UNESCAPED_UNICODE);

