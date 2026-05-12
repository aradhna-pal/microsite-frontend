<?php
$pageTitle = 'Checkout';
$currentPage = 'checkout';
include '_header.php';
?>

<section class="card p-4 shadow-sm">
    <h2 class="mb-3">Checkout Page</h2>
    <form>
        <div class="row g-3">
            <div class="col-md-6"><input class="form-control" type="text" placeholder="First Name"></div>
            <div class="col-md-6"><input class="form-control" type="text" placeholder="Last Name"></div>
            <div class="col-md-6"><input class="form-control" type="email" placeholder="Email"></div>
            <div class="col-md-6"><input class="form-control" type="text" placeholder="Mobile"></div>
            <div class="col-12"><textarea class="form-control" rows="3" placeholder="Address"></textarea></div>
        </div>
        <button type="button" class="btn ms-btn mt-3">Place Order</button>
    </form>
</section>

<?php include '_footer.php'; ?>
