<?php
$pageTitle = 'Order Details';
$currentPage = 'order';
include '_header.php';
?>

<section class="card p-4 shadow-sm">
    <h2 class="mb-3">Order Details Page</h2>
    <p><strong>Order ID:</strong> #1001</p>
    <p><strong>Customer:</strong> Demo User</p>
    <p><strong>Status:</strong> Placed</p>

    <h5 class="mt-4">Items</h5>
    <table class="table">
        <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
        <tbody><tr><td>Sample Product</td><td>1</td><td>Rs. 0.00</td></tr></tbody>
    </table>
</section>

<?php include '_footer.php'; ?>
