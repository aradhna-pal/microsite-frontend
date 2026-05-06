<?php include 'include/header.php'; ?>
<!-- main-content -->
<div class="main-content">
    <!-- main-content-wrap -->
    <div class="main-content-inner">
        <!-- main-content-wrap -->
        <div class="main-content-wrap">
            <div class="flex items-center flex-wrap justify-between gap20 mb-27">
                <h3>Order List</h3>
                <ul class="breadcrumbs flex items-center flex-wrap justify-start gap10">
                    <li>
                        <a href="index.php">
                            <div class="text-tiny">Dashboard</div>
                        </a>
                    </li>
                    <li>
                        <i class="icon-chevron-right"></i>
                    </li>
                    <li>
                        <a href="#">
                            <div class="text-tiny">Order</div>
                        </a>
                    </li>
                    <li>
                        <i class="icon-chevron-right"></i>
                    </li>
                    <li>
                        <div class="text-tiny">Order List</div>
                    </li>
                </ul>
            </div>
            <!-- order-list -->
            <div class="wg-box">
                <div class="flex items-center justify-between gap10 flex-wrap">
                    <div class="wg-filter flex-grow">
                        <form class="form-search">
                            <fieldset class="name">
                                <input type="text" placeholder="Search here..." class="" name="name" tabindex="2"
                                    value="" aria-required="true" required="">
                            </fieldset>
                            <div class="button-submit">
                                <button class="" type="submit"><i class="icon-search"></i></button>
                            </div>
                        </form>
                    </div>
                    <a class="tf-button style-1 w208" href="oder-detail.php"><i class="icon-file-text"></i>Export all
                        order</a>
                </div>
                <div class="wg-table table-all-attribute" style="overflow-x: auto;">
                    <ul class="table-title flex gap20 mb-14" style="min-width: 1200px;">
                        <li style="flex:0 0 60px; max-width:60px;">
                            <div class="body-title">S.No</div>
                        </li>
                        <li style="flex: 1; min-width: 150px;">
                            <div class="body-title">Name</div>
                        </li>
                        <li style="flex: 1; min-width: 150px;">
                            <div class="body-title">Email</div>
                        </li>
                        <li style="flex: 0 0 100px;">
                            <div class="body-title">Mobile No.</div>
                        </li>
                        <li style="flex: 0 0 80px;">
                            <div class="body-title">Pin Code</div>
                        </li>
                        <li style="flex: 0 0 80px;">
                            <div class="body-title">Quantity</div>
                        </li>
                        <li style="flex: 0 0 100px;">
                            <div class="body-title">Total Amount</div>
                        </li>
                        <li style="flex: 0 0 100px;">
                            <div class="body-title">Payment Method</div>
                        </li>
                        <li style="flex: 0 0 100px;">
                            <div class="body-title">Order Status</div>
                        </li>
                        <li style="flex: 0 0 100px;">
                            <div class="body-title">Date</div>
                        </li>
                        <li style="flex: 0 0 80px;">
                            <div class="body-title">Action</div>
                        </li>
                       
                    </ul>
                    <ul class="flex flex-column" id="order-list" style="min-width: 1200px;">
                        <!-- Orders populated by JS -->
                    </ul>
                </div>
                <div class="divider"></div>
                <div class="flex items-center justify-between flex-wrap gap10">
                    <div class="text-tiny">Showing 10 entries</div>
                    <ul class="wg-pagination">
                        <li>
                            <a href="#"><i class="icon-chevron-left"></i></a>
                        </li>
                        <li>
                            <a href="#">1</a>
                        </li>
                        <li class="active">
                            <a href="#">2</a>
                        </li>
                        <li>
                            <a href="#">3</a>
                        </li>
                        <li>
                            <a href="#"><i class="icon-chevron-right"></i></a>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- /order-list -->
        </div>
        <!-- /main-content-wrap -->
    </div>
    <!-- /main-content-wrap -->
    <!-- bottom-page -->
    <div class="bottom-page">
        <div class="body-text">Copyright © 2024 Remos. Design with</div>
        <i class="icon-heart"></i>
        <div class="body-text">by <a href="https://themeforest.net/user/themesflat/portfolio">Themesflat</a> All rights
            reserved.</div>
    </div>
    <!-- /bottom-page -->
</div>
<!-- /main-content -->

<script src="adminApi/order.js"></script>
<?php include 'include/footer.php'; ?>