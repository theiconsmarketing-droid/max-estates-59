<?php
/**
 * Hostinger Apache/LiteSpeed Entry Point for Thank You page
 */
if (file_exists(__DIR__ . '/thank-you.html')) {
    include_once(__DIR__ . '/thank-you.html');
} else {
    header("HTTP/1.1 500 Internal Server Error");
    echo "thank-you.html missing.";
}
