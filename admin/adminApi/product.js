document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-add-product");
    if (form) {
        // Load Dropdowns
        loadProductCategories();
        loadProductSubCategories();
        loadProductChildCategories();
        loadProductBrands();
        loadProductSizes();
        loadProductColors();

        // Cascading Dropdowns Logic
        document.getElementById("CategoryId").addEventListener("change", function (e) {
            const selectedCat = e.target.value;
            const subCatDropdown = document.getElementById("SubCategoryId");
            const childCatDropdown = document.getElementById("ChildCategoryId");

            if (subCatDropdown) {
                subCatDropdown.value = "";
                Array.from(subCatDropdown.options).forEach(opt => {
                    if (opt.value === "") return;
                    opt.style.display = opt.getAttribute("data-category") === selectedCat ? "" : "none";
                });
            }
            if (childCatDropdown) {
                childCatDropdown.value = "";
                Array.from(childCatDropdown.options).forEach(opt => {
                    if (opt.value === "") return;
                    opt.style.display = "none";
                });
            }
        });

        document.getElementById("SubCategoryId").addEventListener("change", function (e) {
            const selectedSubCat = e.target.value;
            const childCatDropdown = document.getElementById("ChildCategoryId");
            
            if (childCatDropdown) {
                childCatDropdown.value = "";
                Array.from(childCatDropdown.options).forEach(opt => {
                    if (opt.value === "") return;
                    opt.style.display = opt.getAttribute("data-subcategory") === selectedSubCat ? "" : "none";
                });
            }
        });

        // Form Submit Logic for Add Product
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const token = localStorage.getItem("authToken");
            if (!token) {
                iziToast.error({ title: "Error", message: "User not authenticated", position: "topRight" });
                return;
            }

            // Sync TinyMCE content into the underlying textarea
            if (typeof tinymce !== 'undefined') {
                tinymce.triggerSave();
            }

            const formData = new FormData(form);

            // Adjust keys to match backend API payload requirements
            if (formData.has('SizeId')) {
                formData.set('SizeIds', formData.get('SizeId'));
                formData.delete('SizeId');
            }
            if (formData.has('ColorId')) {
                formData.set('ColorIds', formData.get('ColorId'));
                formData.delete('ColorId');
            }
            
            const galleryFiles = formData.getAll('GalleryFiles[]');
            if (galleryFiles.length > 0) {
                galleryFiles.forEach(file => formData.append('GalleryFiles', file));
                formData.delete('GalleryFiles[]');
            }

            try {
                const response = await fetch(`${domin}/api/product/addproduct`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` },
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    iziToast.success({ title: "Success", message: result.message || "Product added successfully", position: "topRight" });
                    // setTimeout(() => { window.location.href = "product-list.php"; }, 1500);
                } else {
                    iziToast.error({ title: "Error", message: result.message || "Failed to add product", position: "topRight" });
                }
            } catch (error) {
                console.error(error);
                iziToast.error({ title: "Error", message: "Server error", position: "topRight" });
            }
        });
    }
});

// --- Dropdown Fetch Functions ---
async function loadProductCategories() {
    try {
        const res = await fetch(`${domin}/api/category/get`);
        let data = await res.json();
        const dropdown = document.getElementById("CategoryId");
        if (!dropdown) return;
        dropdown.innerHTML = '<option value="">Select Category</option>';
        
        data = Array.isArray(data) ? data : (data.data || []);
        const addedIds = new Set();
        data.forEach(cat => {
            const id = cat.id || cat._id || cat.Id;
            const status = cat.status !== undefined ? cat.status : cat.Status;
            if (!addedIds.has(id) && (status === true || status === 1 || String(status) === "true")) {
                addedIds.add(id);
                dropdown.insertAdjacentHTML('beforeend', `<option value="${id}">${cat.name || cat.Name}</option>`);
            }
        });
    } catch (err) { console.error(err); }
}

async function loadProductSubCategories() {
    try {
        const res = await fetch(`${domin}/api/subcategory/get`);
        let data = await res.json();
        const dropdown = document.getElementById("SubCategoryId");
        if (!dropdown) return;
        dropdown.innerHTML = '<option value="">Select Sub Category</option>';
        
        data = Array.isArray(data) ? data : (data.data || []);
        const addedIds = new Set();
        data.forEach(sub => {
            const id = sub.id || sub._id || sub.Id;
            const status = sub.status !== undefined ? sub.status : sub.Status;
            if (!addedIds.has(id) && (status === true || status === 1 || String(status) === "true")) {
                addedIds.add(id);
                const opt = document.createElement("option");
                opt.value = id;
                opt.textContent = sub.subCategoryName || sub.SubCategoryName || sub.name || "";
                opt.setAttribute("data-category", sub.categoryId || sub.CategoryId);
                opt.style.display = "none";
                dropdown.appendChild(opt);
            }
        });
    } catch (err) { console.error(err); }
}

async function loadProductChildCategories() {
    try {
        const res = await fetch(`${domin}/api/childcategory/get`);
        let data = await res.json();
        const dropdown = document.getElementById("ChildCategoryId");
        if (!dropdown) return;
        dropdown.innerHTML = '<option value="">Select Child Category</option>';
        
        data = Array.isArray(data) ? data : (data.data || []);
        const addedIds = new Set();
        data.forEach(child => {
            const id = child.id || child._id || child.Id;
            const status = child.status !== undefined ? child.status : child.Status;
            if (!addedIds.has(id) && (status === true || status === 1 || String(status) === "true")) {
                addedIds.add(id);
                const opt = document.createElement("option");
                opt.value = id;
                opt.textContent = child.childCategoryName || child.ChildCategoryName || child.name || "";
                opt.setAttribute("data-subcategory", child.subCategoryId || child.SubCategoryId);
                opt.style.display = "none";
                dropdown.appendChild(opt);
            }
        });
    } catch (err) { console.error(err); }
}

async function loadProductBrands() {
    try {
        const res = await fetch(`${domin}/api/admin/getbrand`);
        let data = await res.json();
        const dropdown = document.getElementById("BrandId");
        if (!dropdown) return;
        dropdown.innerHTML = '<option value="">Select Brand</option>';
        
        data = Array.isArray(data) ? data : (data.data || []);
        const addedIds = new Set();
        data.forEach(brand => {
            const id = brand.id || brand.Id;
            const status = brand.isActive !== undefined ? brand.isActive : (brand.IsActive !== undefined ? brand.IsActive : brand.isactive);
            if (!addedIds.has(id) && (status === true || status === 1 || String(status) === "true")) {
                addedIds.add(id);
                dropdown.insertAdjacentHTML('beforeend', `<option value="${id}">${brand.brandName || brand.BrandName}</option>`);
            }
        });
    } catch (err) { console.error(err); }
}

async function loadProductSizes() {
    try {
        const res = await fetch(`${domin}/api/admin/getsize`);
        let data = await res.json();
        const dropdown = document.getElementById("SizeId");
        if (!dropdown) return;
        dropdown.innerHTML = '<option value="">Select Size</option>';
        
        data = Array.isArray(data) ? data : (data.data || []);
        const addedIds = new Set();
        data.forEach(size => {
            const id = size.id || size.Id;
            const status = size.isActive !== undefined ? size.isActive : (size.IsActive !== undefined ? size.IsActive : size.isactive);
            if (!addedIds.has(id) && (status === true || status === 1 || String(status) === "true")) {
                addedIds.add(id);
                dropdown.insertAdjacentHTML('beforeend', `<option value="${id}">${size.sizeName || size.SizeName}</option>`);
            }
        });
    } catch (err) { console.error(err); }
}

async function loadProductColors() {
    try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${domin}/api/admin/getcolor`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        let data = await res.json();
        const dropdown = document.getElementById("ColorId");
        if (!dropdown) return;
        dropdown.innerHTML = '<option value="">Select Color</option>';
        
        data = Array.isArray(data) ? data : (data.data || []);
        const addedIds = new Set();
        data.forEach(color => {
            const id = color.id || color.Id;
            const status = color.isactive !== undefined ? color.isactive : (color.IsActive !== undefined ? color.IsActive : color.isActive);
            if (!addedIds.has(id) && (status === true || status === 1 || String(status) === "true")) {
                addedIds.add(id);
                dropdown.insertAdjacentHTML('beforeend', `<option value="${id}">${color.colorname || color.ColorName}</option>`);
            }
        });
    } catch (err) { console.error(err); }
}


// get api



// const domin = 'http://microsite_backend.workarya.com';
const api = `${domin}/api/product/getproduct`;

document.addEventListener("DOMContentLoaded", function () {
  const list = document.getElementById("productlist");

  fetch(api)
    .then(res => res.json())
    .then(products => {

      list.innerHTML = "";

      products.forEach(p => {

        // ✅ Image full URL
        const imgUrl = p.image
          ? domin + p.image
          : "images/no-image.png";

        // ✅ Stock badge
        const activeBadge = p.isActive > 0
          ? `<div class="block-available">Active</div>`
          : `<div class="block-not-available">Inactive</div>`;

        const row = `
          <li class="product-item gap14">
            <div class="image no-bg">
              <img src="${imgUrl}" alt="">
            </div>

            <div class="flex items-center justify-between gap20 flex-grow">

              <div class="name">
                <a href="#" class="body-title-2">${p.productName}</a>
              </div>

              <div class="body-text">#${p.id}</div>

              <div class="body-text">₹${p.price}</div>

              <div class="body-text">₹${p.discountPrice}</div>
              <div class="body-text">${p.shortDescription}</div>
              <div class="body-text">${p.categoryName}</div>
              <div class="body-text">${p.colorNames}</div>
              <div class="body-text">${p.sizeNames}</div>
              <div class="body-text">${p.brandName}</div>

              <div class="body-text">${p.stock}</div>

              <div>${activeBadge}</div>

              <div class="body-text">
                ${new Date(p.createdAt).toLocaleDateString()}
              </div>

              <div class="list-icon-function">
                <div class="item text-primary"><i class="icon-edit-3"></i></div>
                
              </div>
              <div class="list-icon-function">
                <div class="item text-danger"><i class="icon-trash-2"></i></div>
              </div>

            </div>
          </li>
        `;

        list.insertAdjacentHTML("beforeend", row);
      });

    })
    .catch(err => console.error("API Error:", err));
});


