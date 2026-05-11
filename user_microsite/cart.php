<?php
$pageTitle = 'Cart';
$currentPage = 'cart';
include '_header.php';
?>

<section class="card p-4 shadow-sm">
    <h2 class="mb-3">Cart Page</h2>
    <p class="text-muted">Ye page selected microsite ke liye cart flow show karega.</p>
    <table class="table">
        <thead><tr><th>Product</th><th>Qty</th><th>Total</th></tr></thead>
        <tbody>
            <tr><td>Sample Product</td><td>1</td><td>Rs. 0.00</td></tr>
        </tbody>
    </table>
    <a href="checkout.php" class="btn ms-btn">Go To Checkout</a>
</section>

<?php include '_footer.php'; ?>
