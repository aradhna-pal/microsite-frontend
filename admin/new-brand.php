<?php include 'include/header.php'; ?>
<!-- main-content -->
<div class="main-content">
    <!-- main-content-wrap -->
    <div class="main-content-inner">
        <!-- main-content-wrap -->
        <div class="main-content-wrap">
            <div class="flex items-center flex-wrap justify-between gap20 mb-27">
                <h3>Brand infomation</h3>
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
                            <div class="text-tiny">Brand</div>
                        </a>
                    </li>
                    <li>
                        <i class="icon-chevron-right"></i>
                    </li>
                    <li>
                        <div class="text-tiny">New brand</div>
                    </li>
                </ul>
            </div>
            <!-- new-category -->
            <div class="wg-box">
                <form class="form-new-product form-style-1" id="newBrandForm">

                    <!-- Brand Name -->
                    <fieldset class="name">
                        <div class="body-title">
                            Brand name <span class="tf-color-1">*</span>
                        </div>
                        <input class="flex-grow" type="text" placeholder="Brand name" name="text" required>
                    </fieldset>

                    <!-- Upload Image -->
                    <fieldset>
                        <div class="body-title">
                            Upload image <span class="tf-color-1">*</span>
                        </div>

                        <div class="upload-image flex-grow">
                            <div class="item up-load">
                                <label class="uploadfile" for="myFile"
                                    style="position:relative; overflow:hidden; cursor:pointer;">

                                    <!-- Icon -->
                                    <span class="icon" id="uploadIcon">
                                        <i class="icon-upload-cloud"></i>
                                    </span>

                                    <!-- Text -->
                                    <span class="body-text" id="uploadText">
                                        Drop your image here or
                                        <span class="tf-color">click to browse</span>
                                    </span>

                                    <!-- File Input -->
                                    <input type="file" id="myFile" name="filename" accept="image/*" hidden>

                                    <!-- Preview Image -->
                                    <img id="imagePreview"
                                        style="display:none; position:absolute; inset:0; width:100%; height:100%; object-fit:contain;" />

                                </label>
                            </div>
                        </div>
                    </fieldset>

                    <!-- Status -->
                    <fieldset class="category">
                        <div class="body-title">Brand Status</div>

                        <label class="switch">
                            <input type="checkbox" id="statusToggle" checked>
                            <span class="slider round"></span>
                        </label>

                        <span id="statusText">Active</span>
                    </fieldset>

                    <!-- Submit -->
                    <div class="bot">
                        <div></div>
                        <button class="tf-button w208" type="submit">Save</button>
                    </div>

                </form>
                <script>
                    const input = document.getElementById("myFile");
                    const preview = document.getElementById("imagePreview");
                    const icon = document.getElementById("uploadIcon");
                    const text = document.getElementById("uploadText");

                    input.addEventListener("change", function () {
                        const file = this.files[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = function (e) {
                            preview.src = e.target.result;
                            preview.style.display = "block";
                            icon.style.display = "none";
                            text.style.display = "none";
                        };
                        reader.readAsDataURL(file);
                    });
                </script>
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