<?php
/**
 * Hostinger Apache/LiteSpeed Entry Point
 * Automatically includes index.html so both PHP and static web servers resolve correctly.
 */
if (file_exists(__DIR__ . '/index.html')) {
    include_once(__DIR__ . '/index.html');
} else {
    header("HTTP/1.1 500 Internal Server Error");
    echo "index.html missing.";
}
