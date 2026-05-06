
<?php include 'include/header.php'; ?>
                    <!-- main-content -->
                    <div class="main-content">
                        <!-- main-content-wrap -->
                        <div class="main-content-inner">
                            <!-- main-content-wrap -->
                            <div class="main-content-wrap">
                                <div class="flex items-center flex-wrap justify-between gap20 mb-27">
                                    <h3 id="order-page-title">Order Details</h3>
                                    <ul class="breadcrumbs flex items-center flex-wrap justify-start gap10">
                                        <li>
                                            <a href="index.php"><div class="text-tiny">Dashboard</div></a>
                                        </li>
                                        <li>
                                            <i class="icon-chevron-right"></i>
                                        </li>
                                        <li>
                                            <a href="oder-list.php"><div class="text-tiny">Order</div></a>
                                        </li>
                                        <li>
                                            <i class="icon-chevron-right"></i>
                                        </li>
                                        <li>
                                            <a href="#"><div class="text-tiny">Order detail</div></a>
                                        </li>
                                        <li>
                                            <i class="icon-chevron-right"></i>
                                        </li>
                                        <li>
                                            <div class="text-tiny" id="breadcrumb-order-id">Loading...</div>
                                        </li>
                                    </ul>
                                </div>
                                <!-- order-detail -->
                                <div class="wg-order-detail">
                                    <div class="left flex-grow">
                                        <div class="wg-box mb-20">
                                            <div class="wg-table table-order-detail">
                                                <ul class="table-title flex items-center justify-between gap20 mb-24">
                                                    <li>
                                                        <div class="body-title">All item</div>
                                                    </li>    
                                                    <li>
                                                        <div class="dropdown default">
                                                            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                <span class="body-title-2 flex items-center gap8">Sort<i class="h6 icon-chevron-down"></i></span>
                                                            </button>
                                                            <ul class="dropdown-menu">
                                                                <li>  
                                                                    <a href="javascript:void(0);">Name</a>
                                                                </li>
                                                                <li>  
                                                                    <a href="javascript:void(0);">Quantity</a>
                                                                </li>
                                                                <li>  
                                                                    <a href="javascript:void(0);">Price</a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <ul class="flex flex-column" id="order-items-list">
                                                    <!-- Items will be dynamically populated by JS here -->
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="wg-box">
                                            <div class="wg-table table-cart-totals">
                                                <ul class="table-title flex mb-24">
                                                    <li>
                                                        <div class="body-title">Cart Totals</div>
                                                    </li>    
                                                    <li>
                                                        <div class="body-title">Price</div>
                                                    </li>    
                                                </ul>
                                                <ul class="flex flex-column gap14">
                                                    <li class="cart-totals-item">
                                                        <span class="body-text">Subtotal:</span>
                                                        <span class="body-title-2" id="cart-subtotal">₹0.00</span>
                                                    </li>
                                                  
                                                   
                                                    <li class="divider"></li>
                                                    <li class="cart-totals-item">
                                                        <span class="body-title">Total price:</span>
                                                        <span class="body-title tf-color-1" id="cart-total">₹0.00</span>
                                                    </li>
                                                  
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="right">
                                        <div class="wg-box mb-20 gap10">
                                            <div class="body-title">Summary</div>
                                            <div class="summary-item">
                                                <div class="body-text">Order ID</div>
                                                <div class="body-title-2" id="summary-order-id">#</div>
                                            </div>
                                            <div class="summary-item">
                                                <div class="body-text">Date</div>
                                                <div class="body-title-2" id="summary-date">-</div>
                                            </div>
                                            <div class="summary-item">
                                                <div class="body-text">Status</div>
                                                <div class="body-title-2" id="summary-status">-</div>
                                            </div>
                                            <div class="summary-item">
                                                <div class="body-text">Total</div>
                                                <div class="body-title-2 tf-color-1" id="summary-total">₹0.00</div>
                                            </div>
                                        </div>
                                        <div class="wg-box mb-20 gap10">
                                            <div class="body-title">Shipping Address</div>
                                            <div class="body-text" id="shipping-address" style="line-height: 1.6;">Loading...</div>
                                        </div>
                                        <div class="wg-box mb-20 gap10">
                                            <div class="body-title">Payment Method</div>
                                            <div class="body-text" id="payment-method">Loading...</div>
                                        </div>
                                        <div class="wg-box gap10">
                                            <div class="body-title">Expected Date Of Delivery</div>
                                            <div class="body-title-2 tf-color-2">20 Nov 2023</div>
                                            <a class="tf-button style-1 w-full" href="oder-tracking.php"><i class="icon-truck"></i>Track order</a>
                                        </div>
                                    </div>
                                </div>
                                <!-- /order-detail -->
                            </div>
                            <!-- /main-content-wrap -->
                        </div>
                        <!-- /main-content-wrap -->
                        <!-- bottom-page -->
                        <div class="bottom-page">
                            <div class="body-text">Copyright © 2024 Remos. Design with</div>
                            <i class="icon-heart"></i>
                            <div class="body-text">by <a href="https://themeforest.net/user/themesflat/portfolio">Themesflat</a> All rights reserved.</div>
                        </div>
                        <!-- /bottom-page -->
                    </div>
                    <!-- /main-content -->

                    <script src="adminApi/order-detail.js"></script>
                    <?php include 'include/footer.php'; ?>
