<?php include 'include/header.php'; ?>
<!-- main-content -->
<div class="main-content">
    <div class="main-content-inner">
        <div class="main-content-wrap">
            <div class="flex items-center flex-wrap justify-between gap20 mb-27">
                <h3>Edit Child Category</h3>
                <ul class="breadcrumbs flex items-center flex-wrap justify-start gap10">
                    <li>
                        <a href="index.php">
                            <div class="text-tiny">Dashboard</div>
                        </a>
                    </li>
                    <li><i class="icon-chevron-right"></i></li>
                    <li>
                        <a href="child-category.php">
                            <div class="text-tiny">Child Category</div>
                        </a>
                    </li>
                    <li><i class="icon-chevron-right"></i></li>
                    <li><div class="text-tiny">Edit Child Category</div></li>
                </ul>
            </div>
            <!-- edit-childcategory -->
            <div class="wg-box">
                <form class="form-new-product form-style-1" id="childcategory-add">

                    <div class="gap22 cols">
                        <!-- Parent Category -->
                        <fieldset class="name">
                            <div class="body-title">Select Category <span class="tf-color-1">*</span></div>
                            <div class="select">
                                <select class="flex-grow" id="parentCategory" name="categoryId" required>
                                    <option value="" disabled selected>Select Category</option>
                                </select>
                            </div>
                        </fieldset>

                        <!-- Sub Category -->
                        <fieldset class="name">
                            <div class="body-title">Select Sub Category <span class="tf-color-1">*</span></div>
                            <div class="select">
                                <select class="flex-grow" id="subCategory" name="subCategoryId" required>
                                    <option value="" disabled selected>Select Sub Category</option>
                                </select>
                            </div>
                        </fieldset>

                        <!-- Child Category Name -->
                        <fieldset class="name">
                            <div class="body-title">Child Category name <span class="tf-color-1">*</span></div>
                            <input class="flex-grow" type="text" id="childCategoryName" placeholder="Child Category name" name="text" required>
                        </fieldset>
                    </div>

                    <!-- Upload Image -->
                    <fieldset>
                        <div class="body-title">Upload image <span class="tf-color-1">*</span></div>
                        <div class="upload-image flex-grow">
                            <div class="item up-load">
                                <label class="uploadfile" for="myFile" style="position:relative; overflow:hidden; cursor:pointer;">
                                    <span class="icon" id="uploadIcon">
                                        <i class="icon-upload-cloud"></i>
                                    </span>
                                    <span class="body-text" id="uploadText">
                                        Drop your image here or <span class="tf-color">click to browse</span>
                                    </span>
                                    <input type="file" id="myFile" name="filename" accept="image/*" hidden>
                                    <img id="imagePreview" style="display:none; position:absolute; inset:0; width:100%; height:100%; object-fit:contain;" />
                                </label>
                            </div>
                        </div>
                    </fieldset>

                    <!-- Status -->
                    <fieldset class="category">
                        <div class="body-title">Child Category Status</div>
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
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/izitoast/dist/js/iziToast.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/izitoast/dist/css/iziToast.min.css">
<script src="./adminApi/domin.js"></script>
<script src="./adminApi/category.js"></script>
<?php include 'include/footer.php'; ?>