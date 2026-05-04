<?php include 'header.php'; ?>


<main class="main">
	<div class="page-header text-center" style="background-image: url('assets/images/page-header-bg.jpg')">
		<div class="container">
			<h1 class="page-title">Checkout<span>Shop</span></h1>
		</div><!-- End .container -->
	</div><!-- End .page-header -->
	<nav aria-label="breadcrumb" class="breadcrumb-nav">
		<div class="container">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><a href="index.html">Home</a></li>
				<li class="breadcrumb-item"><a href="#">Shop</a></li>
				<li class="breadcrumb-item active" aria-current="page">Checkout</li>
			</ol>
		</div><!-- End .container -->
	</nav><!-- End .breadcrumb-nav -->

	<div class="page-content">
		<div class="checkout">
			<div class="container">

				<form action="#" id="checkoutForm">
					<div class="row">
						<div class="col-lg-9">
							<h2 class="checkout-title">Billing Details</h2><!-- End .checkout-title -->
							<div class="row">
								<div class="col-sm-6">
									<label>First Name *</label>
									<input type="text" name="FirstName" class="form-control" placeholder="Enter your first name"
										required>
								</div><!-- End .col-sm-6 -->

								<div class="col-sm-6">
									<label>Last Name *</label>
									<input type="text" name="LastName" class="form-control" placeholder="Enter your last name" required>
								</div><!-- End .col-sm-6 -->
							</div><!-- End .row -->


							<div class="row">
								<div class="col-sm-6">
									<label>Email address *</label>
									<input type="email" name="Email" class="form-control" placeholder="Enter your email address"
										required>
								</div><!-- End .col-sm-6 -->

								<div class="col-sm-6">



									<label>Country *</label>
									<input type="text" name="Country" class="form-control" placeholder="Enter your country" required>
								</div>


							</div>






							<div class="row">
								<div class="col-sm-6">
									<label>Town / City *</label>
									<input type="text" name="City" class="form-control" placeholder="Enter your town or city"
										required>
								</div><!-- End .col-sm-6 -->

								<div class="col-sm-6">
									<label>State *</label>
									<input type="text" name="State" class="form-control" placeholder="Enter your state" required>
								</div><!-- End .col-sm-6 -->
							</div><!-- End .row -->

							<div class="row">
								<div class="col-sm-6">
									<label>Postcode / ZIP *</label>
									<input type="text" name="Pincode" class="form-control"
										placeholder="Enter your postcode or ZIP code" required>
								</div><!-- End .col-sm-6 -->

								<div class="col-sm-6">
									<label>Phone *</label>
									<input type="tel" name="Mobile" class="form-control" placeholder="Enter your phone number"
										required>
								</div><!-- End .col-sm-6 -->
							</div><!-- End .row -->
							<label>Street address *</label>
							<input type="text" name="Address" class="form-control" placeholder="House number and Street name" required>

							<input type="hidden" name="PaymentMethod" id="PaymentMethod" value="COD">






						</div>
						<aside class="col-lg-3">
							<div class="summary">
								<h3 class="summary-title">Your Order</h3><!-- End .summary-title -->

								<table class="table table-summary">
									<thead>
										<tr>
											<th>Product</th>
											<th>Total</th>
										</tr>
									</thead>

									<tbody id="checkoutOrderSummary">
										<tr>
											<td colspan="2" class="text-center">Loading your order...</td>
										</tr>
									</tbody>
								</table><!-- End .table table-summary -->

								<div class="accordion-summary" id="accordion-payment">




									<div class="card">
										<!-- <div class="card-header" id="heading-3">
											<h2 class="card-title">
												<a class="collapsed payment-method-link" role="button" data-toggle="collapse"
													href="#collapse-3" aria-expanded="false" aria-controls="collapse-3" data-method="COD">
													Cash on delivery
												</a>
											</h2>
										</div> -->
										<div id="collapse-3" class="collapse" aria-labelledby="heading-3"
											data-parent="#accordion-payment">
											<div class="card-body">Quisque volutpat mattis eros. Lorem ipsum dolor sit
												amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis
												eros.
											</div><!-- End .card-body -->
										</div><!-- End .collapse -->
									</div><!-- End .card -->




								</div><!-- End .accordion -->

								<button type="submit" class="btn btn-outline-primary-2 btn-order btn-block">
									<span class="btn-text">Place Order</span>
									<span class="btn-hover-text">Proceed to Checkout</span>
								</button>
							</div><!-- End .summary -->
						</aside><!-- End .col-lg-3 -->
					</div><!-- End .row -->
				</form>
			</div><!-- End .container -->
		</div><!-- End .checkout -->
	</div><!-- End .page-content -->
</main><!-- End .main -->

<script src="assets/js/api/checkout.js"></script>
<?php include 'footer.php'; ?>