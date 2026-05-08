<?php include 'header.php'; ?>


<main class="main">
    <div class="page-header text-center" style="background-image: url('assets/images/page-header-bg.jpg')">
        <div class="container">
            <h1 class="page-title">My Account<span>Shop</span></h1>
        </div><!-- End .container -->
    </div><!-- End .page-header -->
    <nav aria-label="breadcrumb" class="breadcrumb-nav mb-3">
        <div class="container">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                <li class="breadcrumb-item"><a href="#">Shop</a></li>
                <li class="breadcrumb-item active" aria-current="page">My Account</li>
            </ol>
        </div><!-- End .container -->
    </nav><!-- End .breadcrumb-nav -->

    <div class="page-content">
        <div class="dashboard">
            <div class="container">
                <div class="row">
                    <aside class=" col-2 ">
                        <ul class="nav nav-dashboard flex-column mb-3 mb-md-0" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active" id="tab-dashboard-link" data-toggle="tab"
                                    href="#tab-dashboard" role="tab" aria-controls="tab-dashboard"
                                    aria-selected="true">Dashboard</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="tab-orders-link" data-toggle="tab" href="#tab-orders" role="tab"
                                    aria-controls="tab-orders" aria-selected="false">Orders</a>
                            </li>
                          
                          
                            <li class="nav-item">
                                <a class="nav-link" href="#">Sign Out</a>
                            </li>
                        </ul>

                        
                    </aside><!-- End .col-lg-3 -->

                    <div class="col-10">
                        <div class="tab-content">
                            <div class="tab-pane fade show active" id="tab-dashboard" role="tabpanel"
                                aria-labelledby="tab-dashboard-link">
                                <p>Hello <span class="font-weight-normal text-dark">User</span> (not <span
                                        class="font-weight-normal text-dark">User</span>? <a href="#">Log out</a>)
                                    <br>
                                    From your account dashboard you can view your <a href="#tab-orders"
                                        class="tab-trigger-link link-underline">recent orders</a>, manage your <a
                                        href="#tab-address" class="tab-trigger-link">shipping and billing addresses</a>,
                                    and <a href="#tab-account" class="tab-trigger-link">edit your password and account
                                        details</a>.
                                </p>
                            </div><!-- .End .tab-pane -->

                            <div class="tab-pane fade" id="tab-orders" role="tabpanel"
                                aria-labelledby="tab-orders-link">

                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover align-middle">
                                        <thead class="table-light">
                                            <tr style="background-color: #ebebeb;">
                                                <th class="p-3">Order ID</th>
                                                <th class="p-3">Name</th>
                                                <th class="p-3">Email</th>
                                                <th class="p-3">Mobile</th>
                                                <th class="p-3">Address</th>
                                                <th class="p-3">City</th>
                                                <th class="p-3">State</th>
                                                <th class="p-3">Country</th>
                                                <th class="p-3">Items</th>
                                                <th class="p-3">Total (₹)</th>
                                                <th class="p-3">Payment</th>
                                                <th class="p-3">Status</th>
                                                <th class="p-3">Date</th>
                                                <th class="p-3">View order</th>
                                                <th class="p-3">Download Pdf</th>
                                            </tr>
                                        </thead>
                                        <tbody id="ordersTableBody">
                                            <!-- Orders will load here -->
                                             

                                        </tbody>
                                    </table>
                                </div>

                            </div>

                           
                            

                          
                        </div>
                    </div><!-- End .col-lg-9 -->
                </div><!-- End .row -->
            </div><!-- End .container -->
        </div><!-- End .dashboard -->
    </div><!-- End .page-content -->
</main><!-- End .main -->


<?php include 'footer.php'; ?>