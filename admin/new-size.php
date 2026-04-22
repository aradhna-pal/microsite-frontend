<?php include 'include/header.php'; ?>
<!-- main-content -->
<div class="main-content">
    <!-- main-content-wrap -->
    <div class="main-content-inner">
        <!-- main-content-wrap -->
        <div class="main-content-wrap">
            <div class="flex items-center flex-wrap justify-between gap20 mb-27">
                <h3>Size infomation</h3>
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
                            <div class="text-tiny">Size</div>
                        </a>
                    </li>
                    <li>
                        <i class="icon-chevron-right"></i>
                    </li>
                    <li>
                        <div class="text-tiny">New size</div>
                    </li>
                </ul>
            </div>
            <!-- new-category -->
            <div class="wg-box">
                <form id="addSizeForm" class="form-new-product form-style-1">

                    <fieldset class="name">
                        <div class="body-title">Size name <span class="tf-color-1">*</span></div>
                        <input class="flex-grow" type="text" placeholder="Size name" name="SizeName" required>
                    </fieldset>

                    <fieldset class="description">
                        <div class="body-title">Description <span class="tf-color-1">*</span></div>
                        <textarea class="flex-grow" name="Description" placeholder="Enter description" rows="4"
                            required></textarea>
                    </fieldset>

                    <fieldset class="category">
                        <div class="body-title mb-10">Status</div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="statusToggle">
                            <span class="slider"></span>
                        </label>
                    </fieldset>

                    <div class="bot">
                        <button class="tf-button w208" type="submit">Save</button>
                    </div>

                </form>
            </div>
            <!-- /new-category -->
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