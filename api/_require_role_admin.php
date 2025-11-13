<?php
require __DIR__.'/_require_auth.php';
if (($_SESSION['rol'] ?? '') !== 'admin') { http_response_code(403); echo json_encode(['error'=>'forbidden']); exit; }
