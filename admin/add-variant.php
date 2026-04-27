<?php include 'include/header.php'; ?>
<!-- main-content -->
<div class="main-content">
    <!-- main-content-wrap -->
    <div class="main-content-inner">
        <!-- main-content-wrap -->
        <div class="main-content-wrap">
            <div class="flex items-center flex-wrap justify-between gap20 mb-27">
                <h3>Add Variant</h3>
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
                        <a href="variant-list.php">
                            <div class="text-tiny">Variant</div>
                        </a>
                    </li>
                    <li>
                        <i class="icon-chevron-right"></i>
                    </li>
                    <li>
                        <div class="text-tiny">Add Variant</div>
                    </li>
                </ul>
            </div>
            <!-- new-product-wrap -->
            <form class="form-new-variant" id="addVariantForm" enctype="multipart/form-data">
                <div class="new-page-wrap">
                    <div class="left">
                        <div class="wg-box">


                            <div class="flex gap24 ">
                               
                                <fieldset class="name">
                                    <div class="body-title mb-10">Product Name</div>
                                    <div class="select">
                                        <select name="prodcutid" id="prodcutid">
                                            <option value="">Select Product Name</option>
                                        </select>
                                    </div>
                                </fieldset>
                                 <fieldset class="name mb-24">
                                    <div class="body-title mb-10">Variant Name <span class="tf-color-1">*</span></div>
                                    <input class="" type="text" placeholder="Variant Name" name="VariantName"
                                        tabindex="0" value="" aria-required="true" required="">
                                </fieldset>

                            </div>


                            <div class="flex gap24 mb-24">
                                <fieldset class="name w-half">
                                    <div class="body-title mb-10">SKU <span class="tf-color-1">*</span></div>
                                    <input class="" type="text" placeholder="SKU" name="Sku" tabindex="0" value=""
                                        aria-required="true" required="">
                                </fieldset>
                                <fieldset class="name w-half">
                                    <div class="body-title mb-10">Stock <span class="tf-color-1">*</span></div>
                                    <input class="" type="number" placeholder="Stock" name="Stock" tabindex="0" value=""
                                        aria-required="true" required="">
                                </fieldset>
                            </div>
                            <div class="flex gap24 mb-24">
                                <fieldset class="name w-half">
                                    <div class="body-title mb-10">Price <span class="tf-color-1">*</span></div>
                                    <input class="" type="number" placeholder="Price" name="Price" tabindex="0" value=""
                                        aria-required="true" required="">
                                </fieldset>
                                <fieldset class="name w-half">
                                    <div class="body-title mb-10">Discount Price</div>
                                    <input class="" type="number" placeholder="Discount Price" name="DiscountPrice"
                                        tabindex="0" value="">
                                </fieldset>

                            </div>

                            <div class="flex gap24 mb-24">
                                <fieldset class="name mb-24">
                                    <div class="body-title mb-10">Sizes</div>
                                    <div class="select">
                                        <select name="SizeId" id="SizeId">
                                            <option value="">Select Size</option>
                                        </select>
                                    </div>
                                </fieldset>
                                <fieldset class="name">
                                    <div class="body-title mb-10">Colors</div>
                                    <div class="select">
                                        <select name="ColorId" id="ColorId">
                                            <option value="">Select Color</option>
                                        </select>
                                    </div>
                                </fieldset>
                            </div>


                        </div>

                    </div>
                    <div class="right">
                        <div class="wg-box">
                            <div>
                                <div class="body-title mb-10">Publish</div>
                                <div class="flex gap10">
                                    <button class="tf-button w-full" type="submit">Save Product</button>
                                </div>
                            </div>
                        </div>
                        <div class="wg-box">
                            <div>
                                <div class="body-title mb-10">Status</div>
                                <div class="select">
                                    <select class="" name="IsActive">
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>


                        <div class="wg-box">
                            <div>
                                <div class="body-title mb-10">Main Image <span class="tf-color-1">*</span></div>
                                <div class="upload-image style-1 mb-16" id="main-image-container">
                                    <div class="item up-load">
                                        <label class="uploadfile" for="ImageFile">
                                            <div class="icon">
                                                <i class="icon-upload-cloud"></i>
                                            </div>
                                            <span class="text-tiny">Drop your image here or <span class="tf-color">click
                                                    to browse</span></span>
                                            <input type="file" id="ImageFile" name="ImageFile" accept="image/*"
                                                required>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="wg-box">
                            <div>
                                <div class="body-title mb-10">Gallery Images</div>
                                <div class="upload-image style-1 mb-16" id="gallery-container">
                                    <div class="item up-load">
                                        <label class="uploadfile" for="GalleryFiles">
                                            <div class="icon">
                                                <i class="icon-upload-cloud"></i>
                                            </div>
                                            <span class="text-tiny">Drop your images here or <span
                                                    class="tf-color">click to browse</span></span>
                                            <input type="file" id="GalleryFiles" name="GalleryFiles[]" multiple
                                                accept="image/*">
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <!-- /new-product-wrap -->
        </div>
        <!-- /main-content-wrap -->
    </div>
    <!-- /main-content-wrap -->

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

<script>
    // Single image preview for Main Image
    document.getElementById('ImageFile').addEventListener('change', function (event) {
        const container = document.getElementById('main-image-container');
        const existingPreview = container.querySelector('.preview-item');
        if (existingPreview) existingPreview.remove();

        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgHTML = `<div class="item preview-item"><img src="${e.target.result}" alt="" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;"></div>`;
                container.insertAdjacentHTML('afterbegin', imgHTML);
            }
            reader.readAsDataURL(file);
        }
    });

    // Multiple image preview for Gallery
    document.getElementById('GalleryFiles').addEventListener('change', function (event) {
        const container = document.getElementById('gallery-container');
        const existingPreviews = container.querySelectorAll('.preview-item');
        existingPreviews.forEach(el => el.remove());

        Array.from(event.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgHTML = `<div class="item preview-item"><img src="${e.target.result}" alt="" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;"></div>`;
                container.insertAdjacentHTML('afterbegin', imgHTML);
            }
            reader.readAsDataURL(file);
        });
    });
</script>


<?php include 'include/footer.php'; ?>