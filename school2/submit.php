<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json');
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

function clean_field($value)
{
    $value = trim((string) $value);
    $value = str_replace(array("\r", "\n"), ' ', $value);
    if ($value !== '' && preg_match('/^[=+@-]/', $value)) {
        $value = "'" . $value;
    }
    return $value;
}

$name = clean_field($_POST['name'] ?? '');
$email = clean_field($_POST['email'] ?? '');
$phone = clean_field($_POST['phone'] ?? '');
$message = clean_field($_POST['message'] ?? '');
$honeypot = $_POST['website'] ?? ''; // Hidden field for bots

// 1. Honeypot check (SPAM protection)
if ($honeypot !== '') {
    header('Content-Type: application/json');
    http_response_code(403);
    echo json_encode(['error' => 'Spam detected. Submission blocked.']);
    exit;
}

if ($name === '' || $email === '' || $phone === '' || $message === '') {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// Name validation (2-50 characters, letters/spaces/dots only)
if (!preg_match('/^[A-Za-z\s\.]{2,50}$/', $name)) {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['error' => 'Invalid name: Must be 2-50 characters and contain only letters, spaces, or dots']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}

// Only @gmail.com is accepted
$email_parts = explode('@', $email);
if (count($email_parts) !== 2 || strtolower($email_parts[1]) !== 'gmail.com') {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['error' => 'Only @gmail.com email addresses are accepted.']);
    exit;
}

// Indian mobile number validation (10 digits, starts with 6-9)
if (!preg_match('/^[6-9][0-9]{9}$/', $phone)) {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['error' => 'Invalid phone number: Must be a 10-digit Indian mobile number starting with 6, 7, 8, or 9']);
    exit;
}

// Message validation (Minimum 10 characters)
if (strlen($message) < 10) {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['error' => 'Invalid message: Must be at least 10 characters long']);
    exit;
}

$file = __DIR__ . DIRECTORY_SEPARATOR . 'bkk_submissions.csv';
$is_new = !file_exists($file);

$fp = fopen($file, 'a');
if (!$fp) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => 'Internal Server Error: Unable to save data locally']);
    exit;
}

if (flock($fp, LOCK_EX)) {
    if ($is_new) {
        fputcsv($fp, array('Timestamp', 'Name', 'Email', 'Phone', 'Message'));
    }
    fputcsv($fp, array(date('c'), $name, $email, $phone, $message));
    flock($fp, LOCK_UN);
}

fclose($fp);

// Provide your Google Apps Script Web App URL here!
$script_url = "https://script.google.com/macros/s/AKfycbwSEo8AA_6W2Um9Uz9v8iyGxmDn0TvhgpT_uNlAbogow9Vuddy58aUIsltAuxq2PTWS/exec";

// Send data to Google Sheets via Apps Script Web App
if ($script_url !== "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec" && $script_url !== "") {
    $post_data = http_build_query(
        array(
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'message' => $message
        )
    );

    $opts = array(
        'http' =>
            array(
                'method' => 'POST',
                'header' => 'Content-Type: application/x-www-form-urlencoded',
                'content' => $post_data,
                'ignore_errors' => true // Allow us to see the response even on error
            )
    );

    $context = stream_context_create($opts);
    $response = file_get_contents($script_url, false, $context);
    
    // Log for debugging (Remove or comment out after it works)
    $log_msg = date('Y-m-d H:i:s') . " - Script URL: " . $script_url . "\n";
    $log_msg .= "Response: " . ($response === false ? "FAILED TO CONNECT" : $response) . "\n";
    
    // Check for HTTP errors
    if (isset($http_response_header)) {
        $log_msg .= "Headers: " . implode(" | ", $http_response_header) . "\n";
    }
    
    file_put_contents(__DIR__ . DIRECTORY_SEPARATOR . 'php_debug.log', $log_msg, FILE_APPEND);
}

header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Thank you! Your message has been sent successfully.']);
exit;
