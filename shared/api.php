<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$configFile = __DIR__ . '/private/db-config.php';
if (!is_file($configFile)) {
    http_response_code(503);
    echo json_encode(['online'=>false, 'database'=>'ERROR', 'message'=>'Configure private/db-config.php']);
    exit;
}
try {
    $cfg = require $configFile;
    $pdo = new PDO(
        'mysql:host=' . $cfg['host'] . ';dbname=' . $cfg['database'] . ';charset=utf8mb4',
        $cfg['username'], $cfg['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 10]
    );
    $count = (int) $pdo->query('SELECT COUNT(*) FROM hosting_checks')->fetchColumn();
    echo json_encode(['online'=>true, 'database'=>'OK', 'backend'=>'InfinityFree / PHP + MySQL',
        'records'=>$count, 'time'=>gmdate('c')], JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
    error_log('HostLab: Database check failed');
    http_response_code(503);
    echo json_encode(['online'=>false, 'database'=>'ERROR', 'message'=>'Database unavailable']);
}
