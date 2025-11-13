<?php
require __DIR__.'/_cors.php';
if (!isset($_SESSION['uid'])) { http_response_code(401); echo json_encode(['error'=>'no_auth']); exit; }
