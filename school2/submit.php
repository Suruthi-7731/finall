<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

function clean_field($value) {
    $value = trim((string)$value);
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

if ($name === '' || $email === '' || $phone === '' || $message === '') {
    http_response_code(400);
    exit('Missing required fields');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit('Invalid email');
}

$file = __DIR__ . DIRECTORY_SEPARATOR . 'bkk_submissions.csv';
$is_new = !file_exists($file);

$fp = fopen($file, 'a');
if (!$fp) {
    http_response_code(500);
    exit('Unable to write file');
}

if (flock($fp, LOCK_EX)) {
    if ($is_new) {
        fputcsv($fp, array('Timestamp', 'Name', 'Email', 'Phone', 'Message'));
    }
    fputcsv($fp, array(date('c'), $name, $email, $phone, $message));
    flock($fp, LOCK_UN);
}

fclose($fp);

// Send email to school
$recipient = 'suruthiv.23bcr@kongu.edu';
$from_domain = $_SERVER['SERVER_NAME'] ?? 'example.com';
$from_email = 'no-reply@' . $from_domain;
$mail_subject = 'New Contact Form - Bharathi Kids Kshethralaya';
$mail_body =
    "School: Bharathi Kids Kshethralaya\n" .
    "Name: {$name}\n" .
    "Email: {$email}\n" .
    "Phone: {$phone}\n" .
    "Message:\n{$message}\n";

$headers = "From: {$from_email}\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

@mail($recipient, $mail_subject, $mail_body, $headers);

header('Location: thankyou.html');
exit;
