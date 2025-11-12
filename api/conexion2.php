<?php
function db_connect() {
    $mysql_username = "root";
    $mysql_password = "";
    $server_name    = "localhost";
    $basededatos    = "programacion2"; // minúsculas

    $conn = mysqli_connect($server_name, $mysql_username, $mysql_password);
    if (!$conn) { die("Error de conexión: " . mysqli_connect_error()); }

    if (!mysqli_select_db($conn, $basededatos)) {
        die("No se pudo seleccionar la BD '$basededatos'");
    }

    mysqli_set_charset($conn, "utf8mb4");
    return $conn;
}

function consultaSQL($campos, $tabla, $condicion = "") {
    $conn = db_connect();
    $sql = $condicion ? "SELECT $campos FROM $tabla WHERE $condicion"
                      : "SELECT $campos FROM $tabla";
    $stmt = mysqli_query($conn, $sql);
    if ($stmt === false) { die("Error en la consulta: " . mysqli_error($conn)); }

    $datos = [];
    while ($fila = mysqli_fetch_assoc($stmt)) { $datos[] = $fila; }

    mysqli_free_result($stmt);
    mysqli_close($conn);
    return $datos;
}

