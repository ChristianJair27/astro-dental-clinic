<?php
/**
 * Endpoint de leads para hosting compartido (Hostinger). Sin dependencias.
 * Config: variables de entorno LEAD_TO / LEAD_FROM, o un archivo lead-config.php
 * FUERA de public_html (ver README). Nunca pongas credenciales en este archivo.
 * LEAD_DRY_RUN=1 → no envía correo, escribe el lead en el log de PHP (pruebas locales).
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $code, array $body): never
{
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function clean(string $key, int $max): string
{
    $v = trim((string)($_POST[$key] ?? ''));
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
    return mb_substr($v, 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

// --- Configuración ---
$cfgFile = dirname(__DIR__, 2) . '/lead-config.php'; // public_html/api → ../../ = fuera de public_html
$cfg = is_file($cfgFile) ? (array)require $cfgFile : [];
$to = getenv('LEAD_TO') ?: ($cfg['to'] ?? '');
$from = getenv('LEAD_FROM') ?: ($cfg['from'] ?? '');
$subjectPrefix = $cfg['subject_prefix'] ?? 'Nueva solicitud de cita';
$dryRun = (getenv('LEAD_DRY_RUN') ?: ($cfg['dry_run'] ?? '')) === '1';

// --- Anti-spam: honeypot y tiempo mínimo (fingimos éxito para no dar pistas al bot) ---
if (clean('website', 200) !== '') {
    respond(200, ['ok' => true]);
}
$ts = (int)($_POST['ts'] ?? 0);
if ($ts > 0 && (int)(microtime(true) * 1000) - $ts < 3000) {
    respond(200, ['ok' => true]);
}

// --- Rate limit: 5 envíos por IP cada 10 minutos ---
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rlFile = sys_get_temp_dir() . '/r505_lead_' . hash('sha256', $ip);
$now = time();
$hits = json_decode((string)@file_get_contents($rlFile), true);
$hits = array_values(array_filter(is_array($hits) ? $hits : [], fn($t) => is_int($t) && $t > $now - 600));
if (!$dryRun && count($hits) >= 5) {
    respond(429, ['ok' => false, 'error' => 'rate_limited']);
}
$hits[] = $now;
@file_put_contents($rlFile, json_encode($hits), LOCK_EX);

// --- Validación ---
$name = clean('name', 80);
$phone = clean('phone', 20);
$email = clean('email', 120);
$service = clean('service', 60);
$message = clean('message', 1000);
$preferredTime = clean('preferred_time', 60);
$patientType = clean('patient_type', 40);
$consent = clean('consent', 1);
$source = clean('source', 40);

$errors = [];
if (mb_strlen($name) < 2) $errors[] = 'name';
if (!preg_match('/^[0-9+()\s-]{8,20}$/', $phone)) $errors[] = 'phone';
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if ($consent !== '1') $errors[] = 'consent'; // aceptación del aviso de privacidad (LFPDPPP)
if ($errors) {
    respond(422, ['ok' => false, 'error' => 'validation', 'fields' => $errors]);
}

$body = "Nombre: $name\nTeléfono: $phone\nCorreo: " . ($email ?: '-') . "\nTratamiento: $service\nHorario preferido: $preferredTime\nTipo de paciente: $patientType\n"
    . "Aceptó aviso de privacidad: sí\nOrigen: $source\n\nMotivo:\n$message\n\n"
    . 'Fecha: ' . date('c') . "\nIP: $ip\n";

if ($dryRun) {
    error_log("[lead DRY RUN]\n" . $body);
    respond(200, ['ok' => true, 'dry_run' => true]);
}

if ($to === '' || $from === '') {
    error_log('lead.php: falta LEAD_TO / LEAD_FROM');
    respond(500, ['ok' => false, 'error' => 'not_configured']);
}

// Cabeceras sin saltos de línea (evita header injection).
$safe = fn(string $s) => str_replace(["\r", "\n"], '', $s);
$headers = [
    'From: ' . $safe($from),
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: R505-lead',
];
if ($email !== '') {
    $headers[] = 'Reply-To: ' . $safe($email);
}
$subject = mb_encode_mimeheader($safe("$subjectPrefix: $name ($service)"), 'UTF-8');

if (!mail($safe($to), $subject, $body, implode("\r\n", $headers))) {
    respond(502, ['ok' => false, 'error' => 'send_failed']);
}
respond(200, ['ok' => true]);
