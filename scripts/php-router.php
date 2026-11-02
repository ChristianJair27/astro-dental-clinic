<?php
// Router para `php -S` que imita Apache/Hostinger: archivo existente → se sirve; si no → 404.html con 404.
// (El servidor embebido de PHP, sin router, cae a index.html en cualquier ruta.)
$root = $_SERVER['DOCUMENT_ROOT'];
$path = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/');
$file = realpath($root . $path);

if ($file !== false && str_starts_with($file, realpath($root))) {
    if (is_file($file)) return false;
    if (is_dir($file) && is_file($file . DIRECTORY_SEPARATOR . 'index.html')) return false;
}

http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
readfile($root . '/404.html');
