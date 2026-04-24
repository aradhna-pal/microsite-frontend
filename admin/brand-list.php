<?php include 'include/header.php'; ?>

<!-- main-content -->
<div class="main-content">
    <!-- main-content-wrap -->
    <div class="main-content-inner">
        <!-- main-content-wrap -->
        <div class="main-content-wrap">
            <div class="flex items-center flex-wrap justify-between gap20 mb-27">
                <h3>All Brand</h3>
                <ul class="breadcrumbs flex items-center flex-wrap justify-start gap10">
                    <li>
                        <a href="index-2.php">
                            <div class="text-tiny">Dashboard</div>
                        </a>
                    </li>
                    <li>
                        <i class="icon-chevron-right"></i>
                    </li>
                    <li>
                        <a href="#">
                            <div class="text-tiny">Brand</div>
                        </a>
                    </li>
                    <li>
                        <i class="icon-chevron-right"></i>
                    </li>
                    <li>
                        <div class="text-tiny">All brand</div>
                    </li>
                </ul>
            </div>
            <!-- all-category -->
            <div class="wg-box">
                <div class="flex items-center justify-between gap10 flex-wrap">
                    <div class="wg-filter flex-grow">
                        <div class="show">
                            <div class="text-tiny">Showing</div>
                            <div class="select">
                                <select class="">
                                    <option>10</option>
                                    <option>20</option>
                                    <option>30</option>
                                </select>
                            </div>
                            <div class="text-tiny">entries</div>
                        </div>
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
                    <a class="tf-button style-1 w208" href="new-brand.php"><i class="icon-plus"></i>Add Brand</a>
                </div>
                <div class="wg-table table-all-attribute">
                    <ul class="table-title flex gap20 mb-14">
                        <li style="flex:0 0 60px; max-width:60px;">
                             <div class="body-title" >S.No</div>
                        </li>
                        <li>
                            <div class="body-title">Image</div>
                        </li>
                     
                        <li>
                            <div class="body-title"> Brand Name</div>
                        </li>
                        <li>
                            <div class="body-title">Status</div>
                        </li>
                        <li>
                            <div class="body-title">Edit</div>
                        </li>
                        <li>
                            <div class="body-title">Delete</div>
                        </li>
                    </ul>
                    <ul class="flex flex-column" id="brandTableBody">
                        <li class="attribute-item flex items-center justify-between gap20 ">
                             <div class="body-text">1</div>
                            <div class="name">
                                <a href="product-list.php" class="body-title-2">Dried food</a>
                            </div>
                          
                            <div class="body-text">1,638</div>
                            <div class="body-text">20</div>
                          
                            <div class="list-icon-function">
                               
                                <div class="item edit">
                                    <i class="icon-edit-3"></i>
                                </div>
                              
                            </div>
                            <div class="list-icon-function">
                               
                             
                                <div class="item trash">
                                    <i class="icon-trash-2"></i>
                                </div>
                            </div>
                        </li>
                    
                      
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
            <!-- /all-category -->
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


<?php include 'include/footer.php'; ?>