<?php
/**
 * Privacy Policy entry point for LiteSpeed/Hostinger
 */
if (file_exists(__DIR__ . '/privacy-policy.html')) {
    include_once(__DIR__ . '/privacy-policy.html');
} else {
    header("HTTP/1.1 500 Internal Server Error");
    echo "privacy-policy.html missing.";
}
