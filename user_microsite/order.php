<?php
$pageTitle = 'Orders';
$currentPage = 'order';
include '_header.php';
?>

<section class="card p-4 shadow-sm">
    <h2 class="mb-3">Order Page</h2>
    <table class="table">
        <thead><tr><th>Order ID</th><th>Status</th><th>Total</th><th>Action</th></tr></thead>
        <tbody>
            <tr>
                <td>#1001</td>
                <td>Placed</td>
                <td>Rs. 0.00</td>
                <td><a class="btn btn-sm ms-btn" href="order-details.php">View Details</a></td>
            </tr>
        </tbody>
    </table>
</section>

<?php include '_footer.php'; ?>
