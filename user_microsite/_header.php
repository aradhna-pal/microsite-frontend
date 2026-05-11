<?php
if (!isset($pageTitle)) {
    $pageTitle = 'Microsite';
}
if (!isset($currentPage)) {
    $currentPage = 'home';
}
$activeSlug = isset($_GET['slug']) ? trim((string)$_GET['slug']) : '';
$activeDomain = isset($_GET['domain']) ? trim((string)$_GET['domain']) : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title><?php echo htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?></title>
    <meta name="description" content="Microsite page">
    <link rel="stylesheet" href="../assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/izitoast/dist/css/iziToast.min.css">
    <script>
        window.MICROSITE_CONTEXT = {
            slug: <?php echo json_encode($activeSlug); ?>,
            domain: <?php echo json_encode($activeDomain); ?>,
            currentPage: <?php echo json_encode($currentPage); ?>
        };
    </script>
    <style>
        :root {
            --ms-header-color: #1f2937;
            --ms-text-color: #ffffff;
            --ms-bg-color: #f9fafb;
            --ms-button-color: #2563eb;
            --ms-button-text-color: #ffffff;
            --ms-footer-color: #111827;
            --ms-footer-text-color: #ffffff;
            --ms-font-family: Arial, sans-serif;
        }
        body {
            background: var(--ms-bg-color);
            font-family: var(--ms-font-family);
        }
        .ms-header {
            background: var(--ms-header-color);
            color: var(--ms-text-color);
        }
        .ms-footer {
            background: var(--ms-footer-color);
            color: var(--ms-footer-text-color);
        }
        .ms-btn {
            background: var(--ms-button-color);
            color: var(--ms-button-text-color);
            border-color: var(--ms-button-color);
        }
        .ms-btn:hover {
            opacity: 0.9;
            color: var(--ms-button-text-color);
        }
        .ms-logo {
            max-height: 48px;
            width: auto;
        }
        .ms-banner {
            width: 100%;
            max-height: 350px;
            object-fit: cover;
            border-radius: 10px;
        }
    </style>
</head>
<body>
<header class="ms-header py-3 mb-4">
    <div class="container d-flex justify-content-between align-items-center">
        <a href="home.php<?php echo $activeSlug !== '' ? '?slug=' . urlencode($activeSlug) : ($activeDomain !== '' ? '?domain=' . urlencode($activeDomain) : ''); ?>" class="text-decoration-none d-flex align-items-center text-reset">
            <img id="msLogo" class="ms-logo me-2" src="../assets/images/demos/demo-7/logo.png" alt="Logo">
            <strong id="msSiteName">Microsite</strong>
        </a>
        <nav class="d-flex gap-3">
            <a class="text-reset" href="home.php">Home</a>
            <a class="text-reset" href="contact.php">Contact</a>
            <a class="text-reset" href="cart.php">Cart</a>
            <a class="text-reset" href="checkout.php">Checkout</a>
            <a class="text-reset" href="order.php">Order</a>
        </nav>
    </div>
</header>
<main class="container pb-5">
