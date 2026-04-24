<?php include 'include/header.php'; ?>
<!-- main-content -->
<div class="main-content">
    <div class="main-content-inner">
        <div class="main-content-wrap">
            <div class="flex items-center flex-wrap justify-between gap20 mb-27">
                <h3>Edit User</h3>
                <ul class="breadcrumbs flex items-center flex-wrap justify-start gap10">
                    <li><a href="index.php"><div class="text-tiny">Dashboard</div></a></li>
                    <li><i class="icon-chevron-right"></i></li>
                    <li><a href="all-user.php"><div class="text-tiny">Users</div></a></li>
                    <li><i class="icon-chevron-right"></i></li>
                    <li><div class="text-tiny">Edit User</div></li>
                </ul>
            </div>
            <div class="wg-box">
                <form class="form-new-product form-style-1" id="user-form">
                    <div class="gap22 cols">
                        <fieldset class="name">
                            <div class="body-title">First Name <span class="tf-color-1">*</span></div>
                            <input class="flex-grow" type="text" id="firstName" placeholder="First Name" required>
                        </fieldset>
                        <fieldset class="name">
                            <div class="body-title">Last Name <span class="tf-color-1">*</span></div>
                            <input class="flex-grow" type="text" id="lastName" placeholder="Last Name" required>
                        </fieldset>
                    </div>
                    <div class="gap22 cols">
                        <fieldset class="name">
                            <div class="body-title">Email <span class="tf-color-1">*</span></div>
                            <input class="flex-grow" type="email" id="userEmail" placeholder="Email Address" required>
                        </fieldset>
                        <fieldset class="name">
                            <div class="body-title">Password (Leave blank to keep current)</div>
                            <input class="flex-grow" type="password" id="userPassword" placeholder="New Password">
                        </fieldset>
                    </div>
                    <div class="gap22 cols">
                        <fieldset class="name">
                            <div class="body-title">Role <span class="tf-color-1">*</span></div>
                            <div class="select">
                                <select class="flex-grow" id="userRole" required>
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                        </fieldset>
                        <fieldset class="category">
                            <div class="body-title">Account Status</div>
                            <label class="switch">
                                <input type="checkbox" id="statusToggle" checked>
                                <span class="slider round"></span>
                            </label>
                            <span id="statusText">Active</span>
                        </fieldset>
                    </div>
                    <div class="bot">
                        <div></div>
                        <button class="tf-button w208" type="submit">Update User</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- bottom-page -->
    <div class="bottom-page">
        <div class="body-text">Copyright © 2024 Remos. Design with</div>
        <i class="icon-heart"></i>
        <div class="body-text">by <a href="https://themeforest.net/user/themesflat/portfolio">Themesflat</a> All rights reserved.</div>
    </div>
    <!-- /bottom-page -->
</div>
<!-- /main-content -->



<?php include 'include/footer.php'; ?>
