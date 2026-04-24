<?php include 'include/header.php'; ?>
<!-- main-content -->
<div class="main-content">
    <!-- main-content-wrap -->
    <div class="main-content-inner">
        <!-- main-content-wrap -->
        <div class="main-content-wrap">
            <div class="flex items-center flex-wrap justify-between gap20 mb-27">
                <h3>Color infomation</h3>
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
                            <div class="text-tiny">Color</div>
                        </a>
                    </li>
                    <li>
                        <i class="icon-chevron-right"></i>
                    </li>
                    <li>
                        <div class="text-tiny">edit color</div>
                    </li>
                </ul>
            </div>
            <!-- new-category -->
            <div class="wg-box">
                <form id="editColorForm" class="form-new-product form-style-1">

                    <fieldset class="name">
                        <div class="body-title">Color name <span class="tf-color-1">*</span></div>
                        <input class="flex-grow" type="text" placeholder="Color name" name="colorname" required>
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